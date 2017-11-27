import {Injectable} from "@angular/core";
@Injectable()
export class appService 
{
    custs: string[];
    custsFilter:string[];
    isDelete:boolean=false; 
    frmNewCon:FormGroup;
    constructor(){
        this.custs = ["shula", "mira", "shira", "nira", "lira"];
       
    }
    search(event)
    {
        this.custsFilter = this.custs.filter(c => c.startsWith(event.target.value));
    }
    delete(state,num?)
    {
        console.log(state);
        if(state==true)
        {
            console.log(num);
            this.custs.splice(num,1);
            this.custsFilter.splice(num,1);
        }
        
    }
    
}