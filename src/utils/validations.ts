
export const mobileNoValid = (value: string) => {
    const regex = /^\d{10}$/;
    if(!regex.test(value)) return "Mobile number should be numbers and 10 digits only.";
    return null;
  };
  
  export const nameValid = (value: string) => {
    const regex = /^[A-Za-z0-9\s'(.)-]+$/;
    if(!regex.test(value)) return "Enter characters only."
    return null;
  };
  
  export const otpValid = (value: string) => {
    const regex = /^\d{4}$/;
    if(!regex.test(value)) return "Otp should be in numbers and 4 digits only."
    return null;
  };
  
  export const questionIdValid = (value: string) => {
    const regex = /^[A-Za-z]+$/;
    if(!regex.test(value)) return "Please enter a valid name (letters only, no spaces)."
    return null;
  };
