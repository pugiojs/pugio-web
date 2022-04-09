import { Injectable } from 'khamsa';
import { CaseTransformerService } from '@pugio/case-transformer';
import _ from 'lodash';

@Injectable()
export class UtilsService extends CaseTransformerService {
    public generateOAuthState(redirectPath = '/') {
        const stateData = {
            clientId: 'deef165b-9e97-4eda-ae4e-cfcc9480b1ea',
            vendor: {
                origin: 'pugio.lenconda.top',
                checked_in_redirect_path: redirectPath,
            },
        };

        return window.btoa(JSON.stringify(stateData));
    }

    public getLoginUrl() {
        const locationHref = window.location.href;
        return `https://login2.lenconda.top/oauth2/authorize?response_type=code&client_id=deef165b-9e97-4eda-ae4e-cfcc9480b1ea&redirect_uri=https://account.lenconda.top/api/v1/auth/callback&scope=offline_access&state=${this.generateOAuthState(locationHref)}`;
    }

    public standardizeQuery(query: Record<string, any>) {
        if (!query) {
            return {};
        }

        return Object.keys(query).reduce((result, key) => {
            const value = query[key];

            if ((!_.isNumber(value) || !_.isBoolean(value)) && !value) {
                return result;
            }

            result[key] = value;

            return result;
        }, {});
    }
}
