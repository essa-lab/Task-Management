import { ApiProperty } from "@nestjs/swagger";

export class ResponseBody<T>{

    @ApiProperty({ example: true })
    success : boolean;
    @ApiProperty({ example: "Text Message" })
    message : string;
    @ApiProperty()
    data? : T;

    constructor(success : boolean, message:string , data?:T){
        this.success = success;
        this.message = message;
        this.data=data;
    }
}

export class ErrorBody<T>{

   @ApiProperty({ example: 'Error Message' })
    message : string|[];
    @ApiProperty({ example: 'Error Type' })
    error : string;
    @ApiProperty({ example: 404 })
    code: number;

    constructor(error : string, message:string|[] , code:number){
        this.error = error;
        this.message = message;
        this.code=code;
    }
}


