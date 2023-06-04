import { KeycloakService } from 'keycloak-angular';
import { keycloakConfigInfo } from 'src/environments/environment';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: keycloakConfigInfo.realm,
        url: keycloakConfigInfo.url,
        clientId: keycloakConfigInfo.clientId,
      },
      initOptions: {

        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod:"S256",
      },
    });
}