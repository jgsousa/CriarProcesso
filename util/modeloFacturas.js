jQuery.sap.declare('sap.sousa.CriarProcesso.util.modeloFacturas');
jQuery.sap.require('sap.ui.model.json.JSONModel')

sap.ui.model.json.JSONModel.extend("sap.sousa.CriarProcesso.util.modeloFacturas", {

    initFromProcesso : function(oData){
        if(oData.items.length != 0){
            var data = {  processo: "", empresa: "", items : [] };
            this.setData(data);

            for(var i = 0; i < oData.items.length; i++){
                item = this.getFacturaForId(oData.items[i]["Factura"]);
                if(!item){
                    var obj = {};
                    obj.FacturaId = oData.items[i]["Factura"];
                    obj.FOB = Number(oData.items[i]["Valor"]);
                    obj.Frete = Number(oData.items[i]["Frete"]);
                    obj.Seguro = Number(oData.items[i]["Seguro"]);
                    obj.CNCA = Number(oData.items[i]["CNCA"]);
                    obj.getCIF = function(){
                        return ( this.FOB + this.Frete + this.Seguro + this.CNCA );
                    }
                    obj.CIF =  obj.getCIF();
                    data.items.push(obj);
                }
                else{
                    item.FOB = item.FOB + Number(oData.items[i]["Valor"]);
                    item.Frete = item.Frete + Number(oData.items[i]["Frete"]);
                    item.Seguro = item.Seguro + Number(oData.items[i]["Seguro"]);
                    item.CNCA = item.CNCA + Number(oData.items[i]["CNCA"]);
                    item.CIF = item.getCIF();
                }
            }
        }
        return this;
    },

    getFacturaForId : function(facturaId){
        var data = this.getData();
        if(data.items){
            for(var i=0; i < data.items.length; i++){
                if(data.items[i]["FacturaId"] == facturaId){
                    return data.items[i];
                }
            }
        }
    },

    getODataObject : function () {
        var processo = { ProcessoId:"", Empresa:"", Facturas : [] };
        var data = this.getData();

        processo.ProcessoId = data.processo;
        processo.Empresa = data.empresa;

        for(var i = 0; i < data.items.length; i++){
            var factura = {};
            factura.FacturaID = data.items[i]["FacturaId"];
            factura.FOB = String(data.items[i]["FOB"]);
            factura.Frete = String(data.items[i]["Frete"]);
            factura.Seguro = String(data.items[i]["Seguro"]);
            factura.CNCA = String(data.items[i]["CNCA"]);
            processo.Facturas.push(factura);
        }
        return processo;
    }
});