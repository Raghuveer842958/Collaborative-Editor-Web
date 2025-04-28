const checkValidData = (email,password) => {
    const checkEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
    // console.log(checkEmail)
    const checkPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    // console.log(checkPassword);
  
    if (!checkEmail) return "Email is not valid";
    if (!checkPassword) return "Please Enter Strong Password";
    if (checkEmail && checkPassword) return null;
  };
  
  export default checkValidData;