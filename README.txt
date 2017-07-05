Integrantes:

Gustavo Bouzaz Paixão - 8936947
Lucas Kassouf Crocomo - 8937420
Lucas Silva Loureiro - 8937184
Luis Paulo Falchi Justino - 8937479

Informação importante -> Nós acidentalmente desenvolvemos o trabalho em Polymer 2, que está em preview e ainda não tem sequer um release estável, o que nos causou diversos problemas, pois além de não ter suporte da comunidade (pois ainda não há quem desenvolva nesta tecnologia) e a documentação ser extremamente incompleta, o próprio Polymer ainda está com alguns bugs e inconsistências. Já discutimos com o professor um possível decréscimo menor de nota por conta desses problemas para inconsistências na aplicação e ele disse que conversaria com o monitor a respeito.

Inicialização->
Pré-requisitos: É necessário ter instalado o git e o node na máquina. Para instalar o polymer basta então executar o comando 'npm install -g polymer-cli' para instalar o Polymer 2 e 'npm install -g bower' para instalar o bower.
Aplicação: Na pasta web executar os comandos 'bower install' e em seguida 'polymer serve --open'. Isso deve abrir a aplicação no navegador.
Servidor: Na pasta server executar o comando 'npm install' e em seguida 'nodemon server.js'.

Observação-> 	Cliente cadastrado: username: user/password: user.
				Administrador cadastrado: username: admin/password: admin.


Navegação e testes->

Cabeçalho: Nome do petshop "PetLoiro" e um icone para login que se o usuário já estiver logado redireciona para sua pagina inicial

Barra Lateral: Menu com links para home-page, compra de produtos e serviços.

home-page: Possui links para cadastro do cliente, compra de produtos e serviços.

my-login: O usuário insere o nome de usuário e senha e clica em entrar, caso o login resultar em sucesso é direcionado para sua pagina inicial de cliente ou
 administrador conforme seu papel no sistema. Se o botão cadastrar for clicado será redirecionado para o cadastro de cliente.

cadastro-cliente: Informações são inseridas textualmente e uma foto é adicionada pelo botão de escolher arquivo, ao clicar em cadastrar, se cadastrado com sucesso,
 o usuário é redirecionado para sua pagina inicial homescreen-usuario.

homescreen-usuario: Aqui o cliente tem acesso a links para a home-page, compra de produtos, cadastrar um animal, agendar serviço, contratar serviço e seu carrinho.

compra-produto: Cada produto possui uma foto, seu nome, descrição e preço. O cliente insere a quantidade desejada do produto e adiciona ao carrinho. Isso pode ser
 feito de uma vez com vários produtos. Se uma quantidade já foi adicionada ao carrinho e outra quantidade adicionada em seguida a útima quantidade adicionada
 prevalece.

my-carrinho: No carrinho aparece o produto, seu preço unitário, a quantidade no carrinho e o preço total da quantidade para cada produto adicionado. É exibido o 
total dos produtos no carrinho. Um produto pode ser excluido do carrinho clicando em "EXCLUIR", para o produto efetivamente sair do carrinho a página deve ser
desatualizada O link em "CONTINUAR COMPRANDO" envia para a compra de produtos e "FINALIZAR COMPRA" direciona para o pagamento.

my-pagamento: Possui campos para os dados do cartão, nome, número do cartão, data de expiração e código de segurança, clicando "PAGAR" uma mensagem de sucesso
 confirma a compra.

cadastro-animal: Informações são inseridas textualmente e uma foto é adicionada pelo botão de escolher arquivo, o botão cadastrar realiza o cadastro. Um usuário
 pode cadastrara mais de um animal.

venda-serviço: Página em que o cliente escolhe um serviço, insere os dados do cartão(mesmos da compra de produto), clicando em "PAGAR" uma mensagem de sucesso
 confirma a contratação.

homescreen-admin: Aqui o administrador tem acesso a links para a home-page, cadastrar um novo administrador, cadastrar cliente, cadastrar um
 animal, criar novos produtos e serviços, agendar e remover agendamento de serviços e histórico de vendas.

cadastro-adm: Os campos nome, email e telefone são para preenchimento e uma imagem pode ser anexa. O botão "CADASTRAR" efetua o cadastro.

cadastro-produto: Nome, descrição e quantidade do produto são inseridos como texto e uma imagem adicionada como arquivo, efetuando o cadastro em "REGISTER".

cadastro-servico: Nome, descrição e preço do serviço são inseridos como texto e uma imagem adicionada como arquivo, efetuando o cadastro em "REGISTER".

gerenciar-agendamento: O serviço a ser agendado é escolhido em um radio button e a data e horário selecionado em uma tabela com horários que ainda não foram 
agendados.

remover-agendamento: Seviços agendados aparecem em uma tabela na data e horário que foram marcados, podendo ser selecionados para remoção.

my-agendamento: O cliente seleciona um serviço já agendado e é direcionado para o pagamento do mesmo.

OBSERVAÇÃO: As páginas de agendamento não se modificam com ações feitas nelas apenas carregam o que está no arquivo agenda.json.

historico-vendas: O administrador tem acesso a uma tabela com todos as compras feitas onde aparece o usuario, o que foi comprado, a quantidade e se foi serviço ou 
produto.