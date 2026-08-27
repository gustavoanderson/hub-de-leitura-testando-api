/// <reference types = "cypress"/>


let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    });
});

describe('Teste de API com GET - Gestão de Usuários', () => {

    it('teste token', () => {
        cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {

        });
    });

    it('Deve listar usários com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users).to.be.an('array')
        })
    });

    it('Deve validar propriedades de um usuário', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users[0]).to.have.property('id')
            expect(response.body.users[0]).to.have.property('name')
            expect(response.body.users[0]).to.have.property('email')
        })
    });

    it('Deve listar um usuário com sucesso buscando por ID', () => {
        cy.api({
            method: 'GET',
            url: 'users/2',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('email')
        })
    });

    it('Deve listar usuário com sucesso usando filtro e parâmetro', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token },
            qs: {
                page: 1,
                limit: 20,
                search: 'Usuário'
            }
        }).should(response => {
            expect(response.status).to.equal(200)
        })
    });

});

describe('Teste de API com POST - Gestão de Usuários', () => {
    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `gustavo-a-${Date.now()}@email.com`
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Gustavo Anderson",
                "email": email,
                "password": "senha123"
            }
        }).should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Usuário criado com sucesso.')
        })
    });

    it('Deve validar um usuário cadastrado com e-mail inválido', () => {
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Gustavo Anderson",
                "email": "gustavoand.com", // errando propositalmente o e-mail //
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Formato de email inválido.')
        })
    });
});

describe('Teste de API com PUT - Gestão de Usuários', () => {
    it('Deve atualizar um usuário com sucesso', () => {
        cy.api({
            method: 'PUT',
            url: 'users/2',
            headers: { 'Authorization': token },
            body: {
                "name": "Gustavo Anderson Novo",
                "email": "joao@email.com",
                "password": "senhanova123"
            }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
        })
    });

    it('Deve atualizar um usuário com sucesso - de forma dinâmica', () => {
        let email = `usuarioteste${Date.now()}@email.com`
        cy.cadastrarUsuario('User Teste', email, 'senha123').then(userId => {
            cy.api({
                method: 'PUT',
                url: 'users/' + userId,
                headers: { 'Authorization': token },
                body: {
                    "name": "Gustavo Anderson Novo",
                    "email": email,
                    "password": "senhanova123"
                }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
            })
        })
    });
});

describe('Teste de API com DELETE - Gestão de Usuários', () => {
    it('Deve excluir um usuário com sucesso - De forma dinâmica (gerando um usuário para apagá-lo na sequência)', () => {
        cy.cadastrarUsuario('teste para deletar', 'email@deletar.com', 'senha123').then(userId => {
            cy.api({
                method: 'DELETE',
                url: `users/${userId}`, ///usando interpolação
                headers: { 'Authorization': token }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Usuário removido com sucesso.')
            })
        })
    });
});
