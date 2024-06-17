# Use a imagem oficial do Node.js para compilar o projeto
FROM node:14 AS build

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o código fonte para o contêiner
COPY . .

# Compile o projeto
RUN npm run build

# Use uma imagem menor do Node.js para servir a aplicação
FROM node:14-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instale o 'serve' globalmente
RUN npm install -g serve

# Copie os arquivos compilados da etapa de build
COPY --from=build /app/dist /app/dist

# Exponha a porta que o 'serve' usará
EXPOSE 5000

# Comando para rodar o 'serve'
CMD ["serve", "-s", "/app/dist", "-l", "5000"]