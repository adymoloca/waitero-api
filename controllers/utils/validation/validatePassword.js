export const validatePassword = (pass) => {
    const counterUppercase = pass.length - pass.replace(/[A-Z]/g, '').length;
    const counterLowercase = pass.length - pass.replace(/[a-z]/g, '').length;
    const counterDigits = pass.replace(/\D/g, '').length;
    const counterWhiteSpaces = pass.split(" ").length-1;
    const counterSpecialChars = (pass.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    const blackListPassword = ["Password", "12345678", "password", "Passw0rd"];
    

    if (pass.length < 8 || pass.length > 32 || counterUppercase == 0 || counterLowercase == 0 || counterDigits == 0 || counterWhiteSpaces != 0 || counterSpecialChars == 0 || blackListPassword.includes(pass)) {
        return false;
   } return true;


}