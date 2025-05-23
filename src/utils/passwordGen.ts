/**
 *
 * @param length
 * @returns a random password base on length
 */
export function generateRandomPassword(length: number = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}

// const passwordLength = 12;
// const newPassword = generateRandomPassword();
// console.log(">>>", newPassword);
