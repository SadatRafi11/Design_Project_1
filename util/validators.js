validateRegisterInput = (email, username, password, confirmPassword) => {
  const errors = {};

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Must be a valid email address";
    }
  }

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (password.length < 6) {
    errors.password = "Password must contain at least 6 chatacters";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (password.length < 6) {
    errors.password = "Password must contain at least 6 chatacters";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = { validateRegisterInput, validateLoginInput };
