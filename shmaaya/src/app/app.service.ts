import {Injectable} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
@Injectable()
export class appService 
{
    custs: string[];
    custsFilter:string[];
    isDelete:boolean=false; 
    frmNewCon:FormGroup;
    frmNewPurchase:FormGroup;
   
    frmNewOrder:FormGroup;
    constructor(){
        this.custs = ["shula", "mira", "shira", "nira", "lira"];
        this.frmNewCon=new FormGroup({
            con_subject: new FormControl('', Validators.required),
            con_content: new FormControl('', Validators.required),
        })
        this.frmNewOrder=new FormGroup({
            custName: new FormControl('', Validators.required),
        })
       
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
    saveOrder(val)
    {
        console.log(val);
        //this.custs.push(frm);
    }
    
}