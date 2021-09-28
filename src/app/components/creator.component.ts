import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";


import * as Survey from "survey-knockout";
import * as SurveyCreator from "survey-creator";


import 'bootstrap/dist/css/bootstrap.css';
import "survey-knockout/survey.css";
import "survey-creator/survey-creator.css";

SurveyCreator.StylesManager.applyTheme("bootstrap");

@Component({
    // tslint:disable-next-line:component-selector
    selector: "creator",
    template: `<div class="survey-container contentcontainer codecontainer" id="surveyCreatorContainer">
    <div id="creatorElement"></div>
  </div>`
})
export class SurveyCreatorComponent implements OnInit {
    @Output() submitSurvey = new EventEmitter<any>();
    @Input()
    result: any;

    ngOnInit() {
        

        Survey.ComponentCollection.Instance.add({
    name: "ordergrid",
    title: "Order Grid",
    questionJSON: {
        type: "matrixdynamic",
        defaultRowValue: { qty: 1 },
        rowCount: 1,
        addRowText: "Add",
        columns: [
        {
            name: "name",
            title: "Name",
            cellType: "text",
            isRequired: true
        },
        {
            name: "dob",
            title: "Date of birth",
            cellType: "text",
            inputType: "date",
        },
        ],
    },
    onInit() {
        //Add "price" property to base "itemvalue" class
        //It will allow us to set our order items into dropdown choices
        //without loosing the price property value
        Survey.Serializer.addProperty("itemvalue", {
          name: "price:number",
          visible: false,
          isSerializable: false,
        });
        //Create a new class derived from Survey.ItemValue
        //It hides text, visibleIf and enableIf properties
        //and makes price property visible for "ordergriditem" class only.
        Survey.Serializer.addClass(
          "ordergriditem",
          [
              {
              name: "price:number",
              default: 0,
              visible: true,
              isSerializable: true,
              },
              { name: "text", visible: false },
              { name: "visibleIf", visible: false },
              { name: "enableIf", visible: false },
          ],
          //We create a standard Survey.ItemValue instance.
          //The third parameter said that the actual type is "ordergriditem"
          //SurveyJS will use properties definition from "ordergriditem" class
          //and it will define "price" property for every new instance
          function () {
              return new Survey.ItemValue(null, null, "ordergriditem");
          },
          "itemvalue"
        );
        //Add orderItems properties. It is an array of ordergriditem elements
        Survey.Serializer.addProperty("ordergrid", {
          name: "orderItems:ordergriditem[]",
          category: "general",
          visibleIndex: 3
        });
    },
    onCreated(question) {
        //The options parameter of this callback function is same as options property survey.onMatrixCellValueChanged event
        //We need to set price on changing the item
        question.contentQuestion.onCellValueChangedCallback = function (options) {
          //If cell in column 'item' is changed
          if (options.columnName == "item") {
              //get price question in this row
              var priceQuestion = options.row.getQuestionByColumnName("price");
              //get item question in this row
              var itemQuestion = options.row.getQuestionByColumnName("item");
              if (!!priceQuestion && !!itemQuestion) {
                //Set price to the price question value
                priceQuestion.value =
                    itemQuestion.selectedItem != null
                    ? itemQuestion.selectedItem.price
                    : 0;
              }
          }
        };
      //The options parameter of this callback function is same as options property survey.onMatrixCellCreated event
      //We need to set min/max properties for qty number question
      question.contentQuestion.onCellCreatedCallback = function (options) {
        if (options.columnName == "qty") {
            options.cellQuestion.min = 1;
            options.cellQuestion.max = 20;
        }
      };
    },
    onLoaded(question) {
        //Set choices to the 'item' column on first loading
        this.updateItemsColumn(question);
    },
    //Calls on property changed in component/root question
    onPropertyChanged(question, propertyName, newValue) {
      if (propertyName == "orderItems") {
        //Calls when orderItems array is changed:
        //new item is added or existing removed or elements order changed
        this.updateItemsColumn(question);
      }
    },
    //Calls when a property of ItemValue element is changed.
    onItemValuePropertyChanged(question, options) {
        //If the propertyName of the array is "orderItems"
        if (options.propertyName == "orderItems") {
          this.updateItemsColumn(question);
        }
    },
    //Set choices to the 'item' column
    updateItemsColumn(question) {
        question.contentQuestion.getColumnByName("item").choices =
        question.orderItems;
    },
});

                        var creatorOptions = {};
                var creator = new SurveyCreator.SurveyCreator("creatorElement", creatorOptions);
                creator.showToolbox = "right";
                creator.showPropertyGrid = "right";
                creator.rightContainerActiveItem("toolbox");
                

        

        creator.JSON = {
    elements: [
        {
            type: "ordergrid",
            name: "question1",
            orderItems: [
                {
                    value: "Steak",
                    price: 27,
                },
                {
                    value: "Salmon",
                    price: 22,
                },
                {
                    value: "Beer",
                    price: 5,
                }
            ]
        }
    ]
};
//Select the order table component
creator.selectedElement = creator.survey.getAllQuestions()[0];
//Show property grid
creator.rightContainerActiveItem("property-grid");
    }
}
