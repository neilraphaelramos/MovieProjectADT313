import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const contactNoRef = useRef();
  const roleRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password, firstName, middleName, lastName, contactNo, role }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      case 'role':
        setRole(event.target.value);
        break;
      default:
        break;
    }
  };

  let apiEndpoint = window.location.pathname.includes('/adminmode') ? '/adminmode/register' : '/user/register';

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo, role };
    setStatus('loading');
    await axios({
      method: 'post',
      url: apiEndpoint,
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);

        // Show the alert message
        setIsError(false);
        setAlertMessage(res.data.message);
        setTimeout(() => {
          navigate('/');
          setStatus('idle');
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setStatus('idle');

        // Show the alert message for account existence or other errors
        setIsError(true);
        setAlertMessage(e.response?.data?.message || e.message);
        setTimeout(() => setAlertMessage(''), 3000);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='d-flex justify-content-center align-items-center color-page' style={{ height: '100vh' }}>
      <div className='p-4 w-25 rounded shadow'
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {alertMessage && (
          <div className={`text-center  alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
            {alertMessage}
          </div>
        )}
        <div>
          <h3 className="text-center"><strong>Welcome to Movie Web App!</strong></h3>
          <p className="text-center">Sign up to unlock the movies, reviews and discover a new content!</p>
          <form>
            <div className="form-group mb-3">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                ref={firstNameRef}
                onChange={(e) => handleOnChange(e, 'firstName')}
                required
              />
              {debounceState && isFieldsDirty && firstName === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="middleName">Middle Name:</label>
              <input
                type="text"
                className="form-control"
                id="middleName"
                name="middleName"
                ref={middleNameRef}
                onChange={(e) => handleOnChange(e, 'middleName')}
                required
              />
              {debounceState && isFieldsDirty && middleName === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                ref={lastNameRef}
                onChange={(e) => handleOnChange(e, 'lastName')}
                required
              />
              {debounceState && isFieldsDirty && lastName === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="contactNo">Contact Number:</label>
              <input
                type="text"
                className="form-control"
                id="contactNo"
                name="contactNo"
                ref={contactNoRef}
                onChange={(e) => handleOnChange(e, 'contactNo')}
                required
              />
              {debounceState && isFieldsDirty && contactNo === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
                required
              />
              {debounceState && isFieldsDirty && email === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
                required
              />
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  onClick={handleShowPassword}
                />
                <label className="form-check-label" htmlFor="showPassword">
                  {isShowPassword ? 'Hide' : 'Show'} Password
                </label>
              </div>
              {debounceState && isFieldsDirty && password === '' && (
                <small className="text-danger">This field is required</small>
              )}
            </div>

            <div className="d-grid mb-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={status === 'loading'}
                onClick={() => {
                  if (email && password && firstName && middleName && lastName && contactNo) {
                    handleRegister();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') emailRef.current.focus();
                    if (password === '') passwordRef.current.focus();
                  }
                }}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>

            <div className="text-center">
              <small>Already have an account? <a href="/">Login</a></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
