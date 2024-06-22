FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o código fonte para o contêiner
COPY . .

# Exponha a porta que o app usará
EXPOSE 3000

# Comando para rodar o app
CMD ["node", "server.js"]
