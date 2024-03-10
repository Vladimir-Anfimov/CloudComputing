class Result {
    public isSuccess: boolean;
    public errors: string[];
    public data: any;

    private constructor(isSuccess: boolean, errors: string[], data: any = null) {
        this.isSuccess = isSuccess;
        this.errors = errors;
        this.data = data;
    }

    public static Success(data: any = null): Result {
        return new Result(true, [], data);
    }

    public static Fail(errors: string[]): Result {
        return new Result(false, errors);
    }
}

export default Result;