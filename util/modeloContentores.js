jQuery.sap.declare('sap.sousa.CriarProcesso.util.modeloContentores');
jQuery.sap.require('sap.ui.model.json.JSONModel')

sap.ui.model.json.JSONModel.extend("sap.sousa.CriarProcesso.util.modeloContentores", {

    initModelo : function(){
        var data = { contentores : [
            { id:"1", matricula:"TESTE1", tipo:"SC20", items:[

            ]},
            { id:"2", matricula:"TESTE2", tipo:"SC40", items:[
                { Descritivo:"4444", Descritivo:2, Unidade:"UN"} , { Descritivo:"555", Quantidade:3, Unidade:"UN"}
            ]}
        ]
        };
        this.setData(data);
    },

    addContentor : function(oObject){

    },

    addItem : function(matricula, object){

        var contentor = this.getForMatricula(matricula);
        if(contentor) {
            if (object.Transf > object.Quantidade) {
                object.Transf = object.Quantidade;
                object.Quantidade = 0;
            }
            else {
                object.Quantidade = Number(object.Quantidade) - Number(object.Transf);
            }
            if(object.Transf > 0) {
                var index = -1;
                for(var i = 0; i < contentor.items.length; i++){
                    if(contentor.items[i]["PedidoID"] == object.PedidoID &&
                        contentor.items[i]["ItemID"] == object.ItemID){
                        var obj = contentor.items[i];
                        obj.Quantidade = Number(obj.Quantidade) + Number(object.Transf);
                        index = i;
                    }
                }
                if(index == -1) {
                    var novo = {};
                    novo.Descritivo = object.Descritivo;
                    novo.Quantidade = Number(object.Transf);
                    novo.Unidade = object.Unidade;
                    novo.Factura = object.Factura;
                    novo.PedidoID = object.PedidoID;
                    novo.ItemID = object.ItemID;
                    contentor.items.push(novo);
                }
                object.Transf = "";
            }
        }
        else{
            sap.m.MessageToast.show("Contentor não encontrado");
        }
    },

    removeItem : function(matricula, object){
        var contentor = this.getForMatricula(matricula);
        var index = 0
        if(contentor){
            for(var i = 0; i < contentor.items.length; i++){
                if(contentor.items[i]["PedidoID"] == object.PedidoID &&
                   contentor.items[i]["ItemID"] == object.ItemID){
                    index = i;
                }
            }
            contentor.items.splice(index,1);
        }
    },

    getForMatricula : function(matricula){
        var data = this.getData();
        for(var i = 0; i < data.contentores.length; i++){
            if(matricula == data.contentores[i]["matricula"]){
                return data.contentores[i];
            }
        }
        return undefined;
    },

    getContextForMatricula : function(matricula){
        var data = this.getData();
        for(var i = 0; i < data.contentores[i].items.length; i++){
            if(matricula == data.contentores[i]["matricula"]){
                return new sap.ui.model.Context(this, "/contentores/" + i);
            }
        }
        return undefined;
    }
})