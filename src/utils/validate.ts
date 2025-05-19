class UserInputValidator {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // Updated regex to allow numbers starting with 0
    const phoneRegex = /^\+?[0-9]\d{1,10}$/;
    return phoneRegex.test(phoneNumber);
  }

  validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username);
  }
}
export default UserInputValidator;
