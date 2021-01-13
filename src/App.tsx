import React from 'react';

import 'styles/App.scss';

import { createEndpoint } from 'api';

const ErrorText: React.FC = ({ children }) => <p className="error-text">{children}</p>;

type ModalProps = {
  handleClose: () => void;
  show: boolean;
};

const isSafeURL = (url: string): boolean => {
  try {
    return encodeURIComponent(url) === decodeURIComponent(url);
  } catch (error) {
    return false;
  }
};

const Modal: React.FC<ModalProps> = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const closeOnEscape = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      handleClose();
    }
  };

  const stopClickPropagation = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  };

  React.useEffect(() => {
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section className="modal-main" onClick={stopClickPropagation}>
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
  const [showSuccessModal, setShowSuccessModal] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let url: string = '';

    try {
      if (!isSafeURL(endpointUrl)) {
        throw new Error();
      }
      url = endpointUrl;
    } catch (err) {
      setError('😢 Only URL safe characters are allowed 😢');
      setIsSubmitting(false);
      return;
    }

    if (!url) {
      setError('🤷‍♂️ Please provide an Endpoint URL 🤷‍♂️');
      setIsSubmitting(false);
      return;
    }

    if (!payload) {
      setError('🤦‍♀️ Please provide some content 🤦‍♀️');
      setIsSubmitting(false);
      return;
    }

    let content: string = '';
    try {
      content = JSON.stringify(JSON.parse(payload));
    } catch (err) {
      setError('😡 Invalid JSON 😡');
      setIsSubmitting(false);
      return;
    }

    try {
      await createEndpoint({ url, content });
      setShowSuccessModal(true);
    } catch (err) {}

    setIsSubmitting(false);
  };

  return (
    <>
      <main>
        <h1>Create a Tiny API</h1>
        <div className="input-group">
          <label htmlFor="endpoint-url">
            Endpoint URL{' '}
            <i>{`(api.tiny-api.dev/temp/${endpointUrl ? endpointUrl : '<endpoint-url>'})`}</i>
          </label>
          <input
            id="endpoint-url"
            type="text"
            placeholder="endpoint-url"
            disabled={isSubmitting}
            value={endpointUrl}
            onChange={(event) => {
              setEndpointUrl(event.target.value);
              if (!isSafeURL(event.target.value)) {
                setError("🤠 Bet it won't work 🤠");
              } else {
                setError('');
              }
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
                const parsedPayload = JSON.stringify(JSON.parse(event.target.value), null, 2);
                setDisplayPayload(parsedPayload);
              } catch (err) {
                setDisplayPayload('Invalid JSON');
              }
            }}
          />
        </div>
        <div className="submit-box">
          {error && <ErrorText>{error}</ErrorText>}
          <button disabled={isSubmitting} type="submit" onClick={handleSubmit}>
            Create Endpoint
          </button>
        </div>
        <Modal
          show={showSuccessModal}
          handleClose={() => {
            setEndpointUrl('');
            setPayload('');
            setShowSuccessModal(false);
          }}
        >
          <h2>Your Tiny API</h2>
          <div className="preview">
            <pre>
              {`URL: ${process.env.REACT_APP_API_URL}/temp/${encodeURIComponent(endpointUrl)}`}
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
