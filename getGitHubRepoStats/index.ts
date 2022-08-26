import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getStats } from './getStats';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a GitHub repo stats request.');
    const stats = await getStats();
    console.log("The stats", stats);
    context.res = {
        body: stats
    };
};

export default httpTrigger;