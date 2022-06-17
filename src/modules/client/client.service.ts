import { Injectable } from '@agros/core';
import { RequestService } from '@modules/request/request.service';
import {
    PaginationResponseData,
    Response,
} from '@modules/request/request.interface';
import {
    GetClientCurrentStatusRequestOptions,
    GetClientCurrentStatusResponseData,
    GetClientInformationRequestOptions,
    GetClientInformationResponseData,
    QueryClientMembersResponseDataItem,
    QueryClientMembersRequestOptions,
    UserClientRelationRequestOptions,
    UserClientRelationResponseData,
    DeleteClientMembersRequestOptions,
    DeleteClientMembersResponseData,
    AddClientMembersRequestOptions,
    AddClientMembersResponseData,
    ChangeClientMembershipRequestOptions,
    ChangeClientMembershipResponseData,
    GetSystemStatusRequestOptions,
    GetSystemStatusResponseData,
    UpdateClientInformationRequestOptions,
    UpdateClientInformationResponseData,
    TransferClientOwnershipRequestOptions,
    TransferClientOwnershipResponseData,
    DeleteClientRequestOptions,
    DeleteClientResponseData,
} from '@modules/client/client.interface';

@Injectable()
export class ClientService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async getUserClientRelation(
        options: UserClientRelationRequestOptions,
    ): Promise<Response<UserClientRelationResponseData>> {
        const { clientId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: '/client/relation',
                query: { clientId },
            });
    }

    public async getClientInformation(
        options: GetClientInformationRequestOptions,
    ): Promise<Response<GetClientInformationResponseData>> {
        const { clientId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client/${clientId}`,
            });
    }

    public async updateClientInformation(
        options: UpdateClientInformationRequestOptions,
    ): Promise<Response<UpdateClientInformationResponseData>> {
        const {
            clientId,
            updates,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'patch',
                url: `/client/${clientId}`,
                data: updates,
            });
    }

    public async getClientCurrentStatus(
        options: GetClientCurrentStatusRequestOptions,
    ): Promise<Response<GetClientCurrentStatusResponseData>> {
        const {
            clientId,
            offlineThreshold = 150000,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client_status/${clientId}`,
                query: {
                    offlineThreshold,
                },
            });
    }

    public async queryClientMembers(
        options: QueryClientMembersRequestOptions,
    ): Promise<PaginationResponseData<QueryClientMembersResponseDataItem>> {
        const {
            clientId,
            ...query
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client/${clientId}/membership`,
                query: {
                    ...query,
                    ...(query.role ? {
                        role: query.role.join(','),
                    } : {}),
                },
            });
    }

    public async deleteClientMembers(
        options: DeleteClientMembersRequestOptions,
    ): Promise<Response<DeleteClientMembersResponseData>> {
        const {
            clientId,
            ...data
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'delete',
                url: `/client/${clientId}/membership`,
                data,
            });
    }

    public async addClientMembers(
        options: AddClientMembersRequestOptions,
    ): Promise<Response<AddClientMembersResponseData>> {
        const {
            clientId,
            memberships,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'post',
                url: `/client/${clientId}/membership`,
                data: { memberships },
            });
    }

    public async changeClientMembership(
        options: ChangeClientMembershipRequestOptions,
    ): Promise<Response<ChangeClientMembershipResponseData>> {
        const {
            clientId,
            memberships,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'post',
                url: `/client/${clientId}/membership`,
                data: { memberships },
            });
    }

    public async getSystemStatus(
        options: GetSystemStatusRequestOptions,
    ): Promise<Response<GetSystemStatusResponseData>> {
        const {
            clientId,
            dateRange,
            pathname,
            count = 30,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client_status/${clientId}/system`,
                query: {
                    pathname,
                    count,
                    dateRange: dateRange.map((dateRangeItem) => dateRangeItem.toISOString()).join('--'),
                },
            });
    }

    public async transferClientOwnership(
        options: TransferClientOwnershipRequestOptions,
    ): Promise<Response<TransferClientOwnershipResponseData>> {
        const {
            clientId,
            owner,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'put',
                url: `/client/${clientId}/membership`,
                data: {
                    owner,
                },
            });
    }

    public async deleteClient(options: DeleteClientRequestOptions): Promise<Response<DeleteClientResponseData>> {
        const { clientId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'delete',
                url: `/client/${clientId}`,
            });
    }
}
