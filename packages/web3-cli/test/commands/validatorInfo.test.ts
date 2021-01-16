import {expect, test} from '@oclif/test'

describe('validatorInfo', () => {
  test
  .stdout()
  .command(['validatorInfo'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['validatorInfo', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
