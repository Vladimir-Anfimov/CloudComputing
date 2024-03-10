import { ServerResponse } from "http";

class ResponseApi {
    public static Ok(response: ServerResponse, data: any) {
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(data));
        response.statusCode = 200;
        response.end();
        return;
    }

    public static Created(response: ServerResponse, data: any) {
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(data));
        response.statusCode = 201;
        response.end();
        return;
    }

    public static BadRequest(response: ServerResponse, data: any) {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 400;
        response.end(JSON.stringify(data));
        return;
    }

    public static NotFound(response: ServerResponse, data: any) {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 404;
        response.end(JSON.stringify(data));
        return;
    }

    public static InternalServerError(response: ServerResponse) {
        response.statusCode = 500;
        response.end();
        return;
    }

    public static NoContent(response: ServerResponse) {
        response.statusCode = 204;
        response.end();
        return;
    }

    public static NotImplemented(response: ServerResponse) {
        response.statusCode = 501;
        response.end();
        return;
    }

    public static MethodNotAllowed(response: ServerResponse) {
        response.statusCode = 405;
        response.end();
        return;
    }

    public static Conflict(response: ServerResponse, data: any) {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 409;
        response.end(JSON.stringify(data));
        return;
    }
}

export default ResponseApi;