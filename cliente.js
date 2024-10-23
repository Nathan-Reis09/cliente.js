const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para solicitar o endereço IP e a porta do servidor
const getServerInfo = () => {
    return new Promise((resolve) => {
        rl.question("Digite o endereço IP do servidor (ou pressione Enter para usar 127.0.0.1): ", (serverHostname) => {
            if (!serverHostname) {
                serverHostname = '127.0.0.1'; // valor padrão
            }
            rl.question("Digite a porta do servidor (ou pressione Enter para usar 10007): ", (portInput) => {
                let port = 10007; // valor padrão
                if (portInput) {
                    const parsedPort = parseInt(portInput);
                    if (!isNaN(parsedPort)) {
                        port = parsedPort;
                    } else {
                        console.error("Porta inválida, usando o padrão 10007.");
                    }
                }
                resolve({ serverHostname, port });
            });
        });
    });
};

// Função principal
const startClient = async () => {
    const { serverHostname, port } = await getServerInfo();

    console.log(`Tentando conectar ao host ${serverHostname} na porta ${port}.`);

    const client = new net.Socket();

    // Conecta ao servidor
    client.connect(port, serverHostname, () => {
        console.log("Conectado ao servidor.");
    });

    // Esta parte é bloqueante na leitura da entrada do usuário
    rl.on('line', (input) => {
        client.write(input); // Envia a entrada do usuário para o servidor
        console.log("input: " + input);
    });

    // Escuta os dados do servidor
    client.on('data', (data) => {
        console.log("echo: " + data.toString().trim());
    });

    client.on('error', (err) => {
        console.error(`Não consegui I/O para a conexão com: ${serverHostname}. ${err.message}`);
        process.exit(1);
    });

    client.on('close', () => {
        console.log("Conexão encerrada.");
        rl.close(); // Fecha a interface de leitura
    });
};

// Inicia o cliente
startClient();
