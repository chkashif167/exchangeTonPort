
export const isAuthenticated = () => {
    let hasToken = localStorage.getItem("jwtToken");
    console.log("curentToken", hasToken)
    if (hasToken) return true;
    return false;
};


export const saveLoginInfo = (email, password) => {
    localStorage.setItem("cur_email", email);
    localStorage.setItem("cur_password", password);
}

export const LoadLoginInfo = () => {
    const email = localStorage.getItem("cur_email");
    const password = localStorage.getItem("cur_password");

    return {email: email, password: password};
}