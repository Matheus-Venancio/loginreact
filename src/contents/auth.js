import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        const userToken = localStorage.getItem("user_token");
        const userStorage = localStorage.getItem("user_db");

        if (userToken && userStorage) {// verifica se tem token e usuario
            const hasUser = JSON.parse(userStorage)?.filter(//Ve se o usuario tem o mesmo email do token
                (user) => user.email === JSON.parse(userToken).email
            );

            if (hasUser) setUser(hasUser[0]);//Se tem, o usuario sera cadastrado
        }
    }, []);

    const signin = (email, pasword) => {
        const userStorage = JSON.parse(localStorage.getItem("users_db"));// recebe um usuario do banco

        const hasUser = userStorage?.filter((user) => user.email === email);// ve se ja existe um emaio igual a esse cadastrado

        if (hasUser?.length) {
            if (hasUser[0].email === email && hasUser[0].pasword === pasword) {// ve se o email e senha são os mesmos
                const token = Math.random().toString(36).substring(2);
                localStorage.setItem("user_token", JSON.stringify({ email, token }))//pra ver qual mail e o nosso tooken
                setUser({ email, pasword });
                return;
            } else {
                return "Email ou senha incorreta"
            }
        } else {
            return "Usuario não cadastrado"
        }
    };

    const signup = (email, password) =>{
        const userStorage = JSON.parse(localStorage.getItem("users_db"))

        const hasUser = userStorage?.filter((user) => user.email === email) //Ve se ja existe um email

        if(hasUser?.length){//Se tiver, retorna isso
            return "Já tem uma conta com esse email"
        }

        let newUser;

        if(userStorage){
            newUser = [...userStorage,{email, password}];//Pega todos os usuarios e adicina um novo
        }else{
            newUser = [{email,password}]///se for o primeiro, ele ja adiciona
        }

        localStorage.setItem("users_db", JSON.stringify(newUser));//Set no userdb

        return;
    };
    
    //Seta o user para null
    const signout = () => {
        setUser(null);
        localStorage.removeItem("user_token");
    };

    //retornando os valores para utilizar em qualquer lugar
    return(
        <AuthContext.Provider
        value={{user,signed: !!user,signin,signup,signout}}
        >
            {children}
        </AuthContext.Provider>
    )
};