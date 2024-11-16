import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  //alert-box
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  let apiEndpoint;

  if (window.location.pathname.includes('/admin')) {
    apiEndpoint = '/admin/login';
  } else {
    apiEndpoint = '/user/login';
  }

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    console.log(data);

    await axios({
      method: 'post',
      url: apiEndpoint,
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsError(false);
        setAlertMessage(res.data.message);
        setTimeout(() => {
          navigate('/main/dashboard');
          setStatus('idle');
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setIsError(true);
        setAlertMessage(e.response?.data?.message || e.message);
        setTimeout(() => {
          setAlertMessage('');
          setStatus('idle');
        }, 3000);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div>
      <div className="color-page">
        <div className="Login-Form">
          {alertMessage && (
            <div className="text-message-box">
              {alertMessage}
            </div>
          )}
          <h1 className="text-title"><strong>Welcome to Movie Web App!</strong></h1>
          <p className="text-description">Unlock the magic of cinema. Explore, discover, and immerse yourself in a world of movies like never before.</p>
          <hr></hr>
          <form className='box-form'>
            <label htmlFor="email"><strong>E-mail:</strong></label>
            <input
              type="text"
              id="email"
              name="email"
              ref={emailRef}
              onChange={(e) => handleOnChange(e, 'email')}
            />
            {debounceState && isFieldsDirty && email === '' && (
              <span className="text-danger"><strong>This field is required</strong></span>
            )}

            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type={isShowPassword ? 'text' : 'password'}
              id="password"
              name="password"
              ref={passwordRef}
              onChange={(e) => handleOnChange(e, 'password')}
            />
            {debounceState && isFieldsDirty && password === '' && (
              <span className="text-danger"><strong>This field is required</strong></span>
            )}

            <div className="form-check">
              <input
                type="checkbox"
                id="showPassword"
                onClick={handleShowPassword}
              />
              <label htmlFor="showPassword">
                {isShowPassword ? 'Hide' : 'Show'} Password
              </label>
            </div>
            <div className='button-box'>
              <button
                type="button"
                className="btn"
                disabled={status === 'loading'}
                onClick={() => {
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') {
                      emailRef.current.focus();
                    }
                    if (password === '') {
                      passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>

              <div className="text-center">
                <a href="/register">Don't have an account? Register</a>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
