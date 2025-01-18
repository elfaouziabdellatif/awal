import RegisterForm from '../components/auth/RegisterForm';
import protectedRouteWhenUserExist from '../utils/protectedWhenUserExist';

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default protectedRouteWhenUserExist(RegisterPage);
