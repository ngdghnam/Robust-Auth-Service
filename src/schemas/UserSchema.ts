class User {
  user_id: string;
  user_name: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_phone: string;
  user_password: string;

  constructor(
    user_id: string,
    user_email: string,
    user_name: string,
    user_first_name: string,
    user_last_name: string,
    user_phone: string,
    user_password: string
  ) {
    this.user_id = user_id;
    this.user_email = user_email;
    this.user_name = user_name;
    this.user_first_name = user_first_name;
    this.user_last_name = user_last_name;
    this.user_phone = user_phone;
    this.user_password = user_password;
  }
}

export default User;
