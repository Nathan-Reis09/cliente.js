const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para solicitar o endereço IP e a porta do servidor
const getServerInfo = () => {
    return new Promise((resolve) => {
        rl.question("Digite o endereço IP para escutar (ou pressione Enter para usar 127.0.0.1): ", (ipAddress) => {
            if (!ipAddress) {
                ipAddress = '127.0.0.1'; // valor padrão
            }
            rl.question("Digite a porta para escutar (ou pressione Enter para usar 10007): ", (portInput) => {
                let port = 10007; // valor padrão
                if (portInput) {
                    const parsedPort = parseInt(portInput);
                    if (!isNaN(parsedPort)) {
                        port = parsedPort;
                    } else {
                        console.error("Porta inválida, usando o padrão 10007.");
                    }
                }
                resolve({ ipAddress, port });
            });
        });
    });
};

// Função principal
const startServer = async () => {
    const { ipAddress, port } = await getServerInfo();

    const server = net.createServer((clientSocket) => {
        console.log("Connection successful");
        console.log("Waiting for input.....");

        // A leitura dos dados é bloqueante
        clientSocket.on('data', (data) => {
            const inputLine = data.toString().trim();
            console.log("Server: " + inputLine);
            clientSocket.write(inputLine); // Envia de volta a mesma mensagem

            if (inputLine.toUpperCase() === "BYE.") {
                clientSocket.end(); // Fecha a conexão se receber "BYE."
            }
        });

        clientSocket.on('end', () => {
            console.log("Connection closed.");
        });
    });

    // O servidor escuta na porta e no IP especificados
    server.listen(port, ipAddress, () => {
        console.log(`Server listening on ${ipAddress}:${port}`);
    });

    server.on('error', (err) => {
        console.error(`Could not listen on port: ${port}. ${err.message}`);
        process.exit(1);
    });
};

// Inicia o servidor
startServer();
