import Authenticator from '../services/feedly/Authenticator'
import { CredentialReceived } from '../constants/eventTypes'
import { GetCredential } from '../constants/actionTypes'
import { AnyEvent, IActionHandler } from '../shared/interfaces'
import { Inject } from '../shared/di/annotations'

@Inject
export default class GetCredentialHandler implements IActionHandler<GetCredential> {
    constructor(private authenticator: Authenticator) {
    }

    async handle(action: GetCredential, dispatch: (event: AnyEvent) => void): Promise<void> {
        const credential = await this.authenticator.getCredential()

        dispatch({
            eventType: CredentialReceived,
            credential
        } as CredentialReceived)
    }
}
