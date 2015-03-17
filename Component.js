jQuery.sap.declare("sap.sousa.CriarProcesso.Component");
jQuery.sap.require("sap.sousa.CriarProcesso.MyRouter");

sap.ui.core.UIComponent.extend("sap.sousa.CriarProcesso.Component", {
    metadata: {
        name: "Criar processo importação",
        version: "1.0",
        includes: [],
        dependencies: {
            libs: ["sap.m", "sap.ui.layout"],
            components: []
        },

        rootView: "sap.sousa.CriarProcesso.view.App",

        config: {
            resourceBundle: "i18n/messageBundle.properties",
            serviceConfig: {
                name: "ZGICV2_CRIAR_SRV",
                serviceUrl: "/sap/opu/odata/sap/ZGICV2_CRIAR_SRV/"
            }
        },

        routing: {
            config: {
                routerClass: sap.sousa.CriarProcesso.MyRouter,
                viewType: "XML",
                viewPath: "sap.sousa.CriarProcesso.view",
                targetAggregation: "pages",
                clearTarget: false
            },
            routes: [
                {
                    pattern: "",
                    name: "main",
                    view: "List",
                    targetControl : "idAppControl"
                },
                {
                    name: "catchallMaster",
                    view: "List",
                    targetControl : "idAppControl"
                }
            ]
        }
    },

    init: function () {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        var mConfig = this.getMetadata().getConfig();

        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var oRootPath = jQuery.sap.getModulePath("sap.sousa.CriarProcesso");

        // set i18n model
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: [oRootPath, mConfig.resourceBundle].join("/")
        });
        this.setModel(i18nModel, "i18n");

        var sServiceUrl = mConfig.serviceConfig.serviceUrl;

        //This code is only needed for testing the application when there is no local proxy available, and to have stable test data.
        var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
        // start the mock server for the domain model
        if (bIsMocked) {
            this._startMockServer(sServiceUrl);
        }

        // Create and set domain model to the component
        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        this.setModel(oModel);

        // set device model
        var oDeviceModel = new sap.ui.model.json.JSONModel({
            isTouch: sap.ui.Device.support.touch,
            isNoTouch: !sap.ui.Device.support.touch,
            isPhone: sap.ui.Device.system.phone,
            isNoPhone: !sap.ui.Device.system.phone,
            listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
        });
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");

        var jModel = new sap.ui.model.json.JSONModel();
        jModel.loadData("model/fornecedores.json", '$format=JSON', false);
        this.setModel(jModel,"Fornecedores");

        this.getRouter().initialize();

    },

    _startMockServer: function (sServiceUrl) {
        jQuery.sap.require("sap.ui.core.util.MockServer");
        var oMockServer = new sap.ui.core.util.MockServer({
            rootUri: sServiceUrl
        });

        var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
        sap.ui.core.util.MockServer.config({
            autoRespondAfter: iDelay
        });

        oMockServer.simulate("model/metadata.xml", "model/");
        oMockServer.start();


        sap.m.MessageToast.show("Running in demo mode with mock data.", {
            duration: 2000
        });
    }
});