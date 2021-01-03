import React from 'react';

import 'styles/App.scss';

import { createEndpoint } from 'api';

interface ISubmissionResult {
  url: string;
  id: number;
  content: string;
}

const ErrorText: React.FC = ({ children }) => (
  <p className="error-text">{children}</p>
);

type ModalProps = {
  handleClose: () => void;
  show: boolean;
};

const Modal: React.FC<ModalProps> = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const closeOnEscape = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      handleClose();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <div className="modal-footer">
          <button type="button" onClick={handleClose}>
            Done
          </button>
        </div>
      </section>
    </div>
  );
};

function App() {
  const [endpointUrl, setEndpointUrl] = React.useState<string>('');
  const [payload, setPayload] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [displayPayload, setDisplayPayload] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState<boolean>(
    false
  );
  const [
    submissionResult,
    setSubmissionResult,
  ] = React.useState<ISubmissionResult>({ url: '', id: 0, content: '' });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let url: string = '';

    try {
      url = encodeURIComponent(endpointUrl);
    } catch (err) {
      setError('Error parsing Endpoint URL');
      setIsSubmitting(false);
      return;
    }

    if (!url) {
      setError('Please provide an Endpoint URL');
      setIsSubmitting(false);
      return;
    }

    let content: string = '';
    try {
      content = JSON.stringify(JSON.parse(payload));
    } catch (err) {
      setError('Invalid JSON');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createEndpoint({ url, content });
      setSubmissionResult(res);
      setShowSuccessModal(true);
    } catch (err) {}

    setIsSubmitting(false);
  };

  return (
    <>
      <main>
        <h1>Create a Tiny API 🧝</h1>
        <div className="input-group">
          <label htmlFor="endpoint-url">
            Endpoint URL <i>{`(api.tiny-api.dev/temp/<endpoint-url>)`}</i>
          </label>
          <input
            id="endpoint-url"
            type="text"
            placeholder="endpoint-url"
            disabled={isSubmitting}
            value={endpointUrl}
            onChange={(event) => {
              setEndpointUrl(event.target.value);
              setError('');
            }}
          />
        </div>
        <div className="input-group">
          <label htmlFor="endpoint-content">Endpoint Content</label>
          <textarea
            id="endpoint-content"
            disabled={isSubmitting}
            placeholder={`{"hello": 1234}`}
            value={payload}
            onChange={(event) => {
              setPayload(event.target.value);
              setError('');
              try {
                const parsedPayload = JSON.stringify(
                  JSON.parse(event.target.value),
                  null,
                  2
                );
                setDisplayPayload(parsedPayload);
              } catch (err) {
                setDisplayPayload('Invalid JSON');
              }
            }}
          />
        </div>
        <div className="submit-box">
          <button disabled={isSubmitting} type="submit" onClick={handleSubmit}>
            Create Endpoint
          </button>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
        <Modal
          show={showSuccessModal}
          handleClose={() => {
            setShowSuccessModal(false);
          }}
        >
          <h2>Your Tiny API</h2>
          <div className="preview">
            <pre>
              {`URL: ${process.env.REACT_APP_API_URL}/temp/${encodeURIComponent(
                endpointUrl
              )}`}
              <br />
              Method: GET
              <br />
              <br />
              Response:
              <br />
              {displayPayload}
            </pre>
          </div>
        </Modal>
      </main>
    </>
  );
}

export default App;
