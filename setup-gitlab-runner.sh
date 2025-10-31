#!/bin/bash

# ========================================
# Script de Configuração do GitLab Runner
# Para Testes Mobile Android
# ========================================

set -e

echo "🚀 Iniciando configuração do GitLab Runner para testes mobile..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para printar mensagens
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar se Docker está instalado
print_info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado!"
    echo "Instale Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
print_info "Docker encontrado: $(docker --version)"

# 2. Instalar GitLab Runner
print_info "Instalando GitLab Runner..."

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
    sudo apt-get install gitlab-runner
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew install gitlab-runner
    
else
    print_error "Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

print_info "GitLab Runner instalado: $(gitlab-runner --version)"

# 3. Solicitar informações do GitLab
echo ""
print_info "Configuração do GitLab..."
read -p "URL do GitLab (ex: https://gitlab.com): " GITLAB_URL
read -p "Token do Runner (veja em Settings > CI/CD > Runners): " RUNNER_TOKEN
read -p "Nome do Runner (ex: docker-android-runner): " RUNNER_NAME

# 4. Registrar Runner
print_info "Registrando Runner no GitLab..."
sudo gitlab-runner register \
  --non-interactive \
  --url "$GITLAB_URL" \
  --registration-token "$RUNNER_TOKEN" \
  --executor "docker" \
  --docker-image "node:18" \
  --description "$RUNNER_NAME" \
  --tag-list "docker,linux,android" \
  --run-untagged="false" \
  --locked="false" \
  --access-level="not_protected" \
  --docker-privileged="true" \
  --docker-shm-size="2147483648" \
  --docker-volumes "/cache" \
  --docker-volumes "/var/run/docker.sock:/var/run/docker.sock"

print_info "✅ Runner registrado com sucesso!"

# 5. Configurar Runner para Android
print_info "Configurando Runner para Android..."

RUNNER_CONFIG="/etc/gitlab-runner/config.toml"

# Fazer backup do config
sudo cp $RUNNER_CONFIG ${RUNNER_CONFIG}.backup

# Adicionar configurações específicas para Android
sudo bash -c "cat >> $RUNNER_CONFIG << 'EOF'

# Configurações adicionais para testes Android
[[runners]]
  environment = [
    \"ANDROID_HOME=/opt/android-sdk\",
    \"ANDROID_SDK_ROOT=/opt/android-sdk\",
    \"JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64\"
  ]
EOF
"

print_info "✅ Configuração do Runner concluída!"

# 6. Iniciar Runner
print_info "Iniciando GitLab Runner..."
sudo gitlab-runner start

# 7. Verificar status
print_info "Verificando status do Runner..."
sudo gitlab-runner status

# 8. Criar imagem Docker customizada (opcional)
echo ""
read -p "Deseja criar uma imagem Docker otimizada para Android? (s/N): " CREATE_IMAGE

if [[ "$CREATE_IMAGE" =~ ^[Ss]$ ]]; then
    print_info "Criando Dockerfile otimizado..."
    
    cat > Dockerfile.gitlab-runner << 'DOCKEREOF'
FROM node:18

# Instalar Java
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk wget unzip && \
    apt-get clean

# Configurar variáveis de ambiente
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Instalar Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip -q commandlinetools-linux-9477386_latest.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm commandlinetools-linux-9477386_latest.zip

# Aceitar licenças
RUN yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses || true

# Instalar componentes do Android SDK
RUN ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "emulator" \
    "system-images;android-33;google_apis;x86_64" \
    "build-tools;33.0.0"

# Instalar Appium globalmente
RUN npm install -g appium@next && \
    appium driver install uiautomator2

# Criar diretório de trabalho
WORKDIR /builds

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version && java --version && adb --version
DOCKEREOF

    print_info "Dockerfile criado em: Dockerfile.gitlab-runner"
    
    read -p "Deseja buildar a imagem agora? (s/N): " BUILD_IMAGE
    
    if [[ "$BUILD_IMAGE" =~ ^[Ss]$ ]]; then
        print_info "Buildando imagem Docker..."
        docker build -t gitlab-runner-android:latest -f Dockerfile.gitlab-runner .
        print_info "✅ Imagem criada: gitlab-runner-android:latest"
        
        print_warning "Atualize o .gitlab-ci.yml para usar a imagem:"
        echo "  image: gitlab-runner-android:latest"
    fi
fi

# 9. Resumo final
echo ""
echo "=========================================="
print_info "✅ Configuração concluída com sucesso!"
echo "=========================================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Verifique se o Runner aparece no GitLab:"
echo "   Settings > CI/CD > Runners"
echo ""
echo "2. Faça commit do .gitlab-ci.yml:"
echo "   git add .gitlab-ci.yml"
echo "   git commit -m 'ci: adiciona pipeline GitLab CI/CD'"
echo "   git push"
echo ""
echo "3. Crie um Merge Request para testar:"
echo "   git checkout -b test/pipeline"
echo "   git push origin test/pipeline"
echo ""
echo "4. Configure GitLab Pages:"
echo "   Settings > Pages > New Pages Domain"
echo ""
echo "5. Configure Schedule para testes noturnos:"
echo "   CI/CD > Schedules > New schedule"
echo ""
echo "📚 Documentação completa: CI_CD_GUIDE.md"
echo ""
print_info "Runner Name: $RUNNER_NAME"
print_info "Tags: docker, linux, android"
print_info "Status: $(sudo gitlab-runner status)"
echo ""
