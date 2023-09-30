Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){

    cy.get('#firstName').type('Luiz Fernando')
    cy.get('#lastName').type('Costa de Souza')
    cy.get('#email').type('luizxtcosta@gmail.com')
    cy.get('#open-text-area').type("Teste")
    cy.contains('button', 'Enviar').click()
})