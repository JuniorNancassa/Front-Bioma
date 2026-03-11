async function register() {
    console.log("Entrou no registro");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;
    const role = "USER"; // sempre USER
    const termsChecked = document.getElementById("terms").checked;

    // Validação dos campos obrigatórios
    if (![name, email, login, password].every(Boolean)) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Validação de e-mail com domínio
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um e-mail válido (com domínio).");
        return;
    }

    // Termos de uso
    if (!termsChecked) {
        alert("Você precisa concordar com os termos e política.");
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nomeCompleto: name,
                email,
                login,
                password,
                role
            })
        });

        if (res.ok) {
            alert("Cadastro realizado com sucesso! Faça login.");
            window.location.href = "login.html";
        } else {
            const data = await res.json().catch(() => null);
            alert("Erro no cadastro: " + (data?.message || res.statusText));
        }
    } catch (error) {
        console.error("Erro de rede ou servidor inacessível", error);
        alert("Erro de rede ou servidor inacessível.");
    }
}
