/// <reference types="Cypress" /> 



describe('Central de Atendimento ao Cliente TAT', function(){

    const TRHEE_SECONDS_IN_MS = 3000

    beforeEach(function() {
        cy.visit('./src/index.html')
    })


    it ('verifica o título da aplicação', function () {
      

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')


        const longText = "eu não sei o que mais vou fazer eu não sei mais o que vou fazer eu não sei o que mais vou fazer eu não sei mais o que vou fazer eu não sei o que mais vou fazer eu não sei mais o que vou fazer"

        cy.clock()
        cy.get('#firstName').type('Luiz Fernando')
        cy.get('#lastName').type('Costa de Souza')
        cy.get('#email').type('luizxtcosta@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')

        cy.tick(TRHEE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')

    }) 

    it ('exibe mensagem de erro ao submeter o formulário com um e-mail com formatação errada', function() {

        cy.get('#firstName').type('Luiz Fernando')
        cy.get('#lastName').type('Costa de Souza')
        cy.get('#email').type('luizxtcostagmail.com')
        cy.get('#open-text-area').type('text')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    }) 

    it ('verifique se o campo está vazio apos tentativa de escrever texto no lugar de numeros', function(){
        cy.get('#phone')
        .type('abcdefghijklmnopqrstuwyxz')
        .should('have.value', '')
    })

    Cypress._.times(10, function(){
        it (' exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulario', function(){
            cy.clock()
            cy.get('#firstName').type('Luiz Fernando')
            cy.get('#lastName').type('Costa de Souza')
            cy.get('#email').type('luizxtcosta@gmail.com')
            cy.get('#phone-checkbox').check()
            cy.get('#open-text-area').type('text')
            cy.contains('button', 'Enviar').click()
            cy.get('.error').should('be.visible')
            cy.tick(TRHEE_SECONDS_IN_MS)
            cy.get('.error').should('not.be.visible')
    
    
        })
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Luiz Fernando')
        .should('have.value', 'Luiz Fernando')
        .clear().should('have.value', '')
        cy.get('#lastName').type('Costa de Souza')
        .should('have.value', 'Costa de Souza')
        .clear().should('have.value', '')
        cy.get('#email').type('luizxtcosta@gmail.com')
        .should('have.value', 'luizxtcosta@gmail.com')
        .clear().should('have.value', '')
        cy.get('#phone').type('34343434')
        .should('have.value', '34343434')
        .clear().should('have.value', '')
    })

    it ('exibe a mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click()
        cy.clock()
        cy.get('.error').should('be.visible')
        cy.tick(TRHEE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

    })

    it ('envia formulário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()
        cy.clock()
        cy.get('.success').should('be.visible')
        cy.tick(TRHEE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')

    })

    it ('Seleciona um produto (You Tube) por seu texto', function(){
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it ('seleciona um produto (mentoria) por seu valor (value)', function(){
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it ('seleciona um produto (blog) por seu índice', function(){
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marco o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    it ('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })

    })

    it ('marca ambos checkboxes, depois desmarca o ultimo', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it ('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal("example.json")
        })
        
    })
    it ('selecione um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})// quase que como arrastar um arquivo para área de transferencia
        .should(function($input) {
            expect($input[0].files[0].name).to.equal("example.json")
        })
    })

    it ('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')//alias
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')//passa o nome do alias
        .should(function($input) {
            expect($input[0].files[0].name).to.equal("example.json")
        })
    })

    it ('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })
    it ('acessa a página de política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        cy.contains('Talking About Testing')
    })

    // .invoke para exibir a mensagem de uma classe sem precisar forçar essa mensagem aparecer, caso voce precisa apenas validar uma mensagem
    it ('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function(){
        cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
        cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')

    })

     it ('preenche a area de texto usando o camando invoke', function(){
       const longText = Cypress._.repeat('***      Luiz Fernando Costa de Souza         *** ', 5)

         cy.get('#open-text-area')
        .invoke('val', longText)
        .should('have.value', longText)
    })

    it ('faz uma requisição HTTP', function (){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function(response){
            const { status, statusText, body} = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
            expect(body).to.include('🐈')


        })
    })

    it.only('encontre o gatinho escondido, exercicio', function() {
        cy.get('#cat')
        .invoke('show')
        .should('be.visible')
        cy.get('#title')
        .invoke('text', "CAT TAT")
        cy.get('#subtitle')
        .invoke('text', 'Eu 💚 gatos!')
    })
    
})