import logo from './logo.svg';
import './App.css';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useState } from 'react';
import { GlobalStyles, StyledEngineProvider } from '@mui/styled-engine';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';

function App() {
  const organisationId = 12;

  const INIT_FORM_DATA = {
    propertyA: "", categoryA: {
    }, categoryB: {
      type: "categoryb",
      "components": []
    },
    categoryC: {
      type: "categoryc",
      "components": []
    }
  };

  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(INIT_FORM_DATA)));
  const [formErrors, setFormErrors] = useState([]);
  const CATEGORY_B_TYPES = {
    categoryBV1: "Category B V1"
  };

  const CATEGORY_C_TYPES = {
    categoryCV1: "Category C V1",
    categoryCV2: "Category C V2"
  };

  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "DataFormatCreateRequest",
    "type": "object",
    "definitions": {
      "categoryBOnV1Select": {
        "type": "object",
        "description": "Category B content on B1 select",
        "properties": {
          "categoryBV1Prop1": {
            "type": "integer",
            "format": "int32",
            "minimum": 1
          },
          "categoryBV1Prop2": {
            "type": "integer",
            "format": "int32",
            "minimum": 1,
            "multipleOf": 10000
          }
        }
      },
      "categoryCOnV1Select": {
        "type": "object",
        "properties": {
          "categoryCV1Prop1": {
            "type": "integer",
            "format": "int32",
            "minimum": 1
          },
          "categoryCV1Prop2": {
            "type": "string",
            "maxLength": 1,
            "minLength": 1
          },
          "categoryCV1Prop3": {
            "type": "string",
            "maxLength": 1,
            "minLength": 1
          },
        },
      },
      "categoryCOnV2Select": {
        "type": "object",
        "description": "The XLS/XLSX reader configuration",
        "properties": {
          "categoryCV2Prop1": {
            "type": "array",
            "description": "The list of sheets for processing",
            "items": {
              "type": "object",
              "properties": {
                "categoryCV2Prop11": {
                  "type": "string",
                  "minLength": 1
                },
                "categoryCV2Prop12": {
                  "type": "integer",
                  "format": "int32"
                },
                "categoryCV2Prop13": {
                  "type": "string"
                }
              }
            },
            "minItems": 1
          }
        },
        "required": ["categoryCV2Prop1"]
      }
    },
    "properties": {
      "propertyA": {
        "type": "string",
        "minLength": 1,
        "maxLength": 128
      },
      "categoryA": {
        "type": "object",
        "properties": {
          "categoryAProp1": {
            "type": "string",
            "oneOf": [
              { "const": "O1", "title": "O 1" },
              { "const": "O2", "title": "O 2" },
              { "const": "O3", "title": "O 3" },
              { "const": "O4", "title": "O 4" }
            ],
            "description": "The type of file"
          },
          "categoryAProp2": {
            "type": "object",
            "required": ["categoryAProp21"],
            "properties": {
              "categoryAProp21": {
                "type": "string",
                "minLength": 1
              },
            }
          }
        },
        "required": ["categoryAProp2", "categoryAProp1"],
      },
      "categoryB": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
          },
          "components": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "commonProp1": {
                  "type": "integer",
                  "format": "int64"
                },
                "commonProp2": {
                  "type": "string",
                  "oneOf": Object.entries(CATEGORY_B_TYPES).map(([key, value]) => ({
                    const: key,
                    title: value
                  }))
                },
                "commonProp3": {
                  "type": "object",
                  "additionalProperties": true
                },
                "categoryBOnV1Select": {
                  "$ref": "#/definitions/categoryBOnV1Select"
                }
              },
              "required": ["categoryBProp2"],
              "oneOf": [
                {
                  "properties": {
                    "commonProp2": {
                      "const": "categoryBV1"
                    }
                  },
                  "required": ["categoryBOnV1Select"]
                }
              ]
            }
          }
        }
      },
      "categoryC": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "components": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "commonProp1": {
                  "type": "integer",
                  "format": "int64",
                  "description": "The parent catalog id"
                },
                "commonProp2": {
                  "type": "string",
                  "description": "The component name",
                  "oneOf": Object.entries(CATEGORY_C_TYPES).map(([key, value]) => ({
                    const: key,
                    title: value
                  }))
                },
                "commonProp3": {
                  "type": "object",
                  "additionalProperties": true
                },
                "categoryCOnV1Select": {
                  "$ref": "#/definitions/categoryCOnV1Select"
                },
                "categoryCOnV2Select": {
                  "$ref": "#/definitions/categoryCOnV2Select"
                }
              },
              "required": ["commonProp1", "commonProp3"],
              "oneOf": [
                {
                  "if": {
                    "properties": {
                      "commonProp2": { "const": "categoryCV1" }
                    }
                  },
                  "then": {
                    "required": ["categoryCOnV1Select"]
                  }
                },
                {
                  "if": {
                    "properties": {
                      "commonProp2": { "const": "categoryCV2" }
                    }
                  },
                  "then": {
                    "required": ["categoryCOnV2Select"]
                  }
                }
              ]
            }
          }
        }
      },
    },
    "required": [
      "propertyA",
      "categoryA",
      "categoryB",
      "categoryC"
    ]
  };

  const uischema = {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "HorizontalLayout",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/propertyA"
          }
        ]
      },
      {
        "type": "HorizontalLayout",
        "elements": [
          {
            "type": "Categorization",
            "elements": [
              {
                "type": "Category",
                "label": "Category A Details",
                "elements": [
                  {
                    "type": "VerticalLayout",
                    "scope": "#/properties/categoryA",
                    "elements": [
                      {
                        "type": "Control",
                        "scope": "#/properties/categoryA/properties/categoryAProp1"
                      },
                      {
                        "type": "Group",
                        "scope": "#/properties/categoryA/properties/categoryAProp2",
                        "elements": [
                          {
                            "type": "HorizontalLayout",
                            "elements": [
                              {
                                "type": "Control",
                                "scope": "#/properties/categoryA/properties/categoryAProp2/properties/categoryAProp21"
                              }
                            ]
                          },
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "Category",
                "label": "Category B Details",
                "elements": [
                  {
                    "type": "VerticalLayout",
                    "scope": "#/properties/categoryB",
                    "elements": [
                      {
                        "type": "Control",
                        "scope": "#/properties/categoryB/properties/type",
                        "options": {
                          "readonly": true
                        }
                      },
                      {
                        "type": "Control",
                        "scope": "#/properties/categoryB/properties/components",
                        "options": {
                          "elementLabelProp": "commonProp2",
                          "detail": {
                            "type": "VerticalLayout",
                            "elements": [
                              {
                                "type": "Control",
                                "scope": "#/properties/commonProp2"
                              },
                              {
                                "type": "Control",
                                "scope": "#/properties/categoryBOnV1Select",
                                "label": "Configuration",
                                "rule": {
                                  "effect": "SHOW",
                                  "condition": {
                                    "scope": "#/properties/commonProp2",
                                    "schema": {
                                      "const": "categoryBV1"
                                    },
                                    "failWhenUndefined": true
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "type": "Category",
                "label": "Catgory C Details",
                "elements": [
                  {
                    "type": "VerticalLayout",
                    "scope": "#/properties/categoryC",
                    "elements": [
                      {
                        "type": "Control",
                        "scope": "#/properties/categoryC/properties/type",
                        "options": {
                          "readonly": true
                        }
                      },
                      {
                        "type": "Control",
                        "scope": "#/properties/categoryC/properties/components",
                        "options": {
                          "elementLabelProp": "commonProp2",
                          "detail": {
                            "type": "VerticalLayout",
                            "elements": [
                              {
                                "type": "Control",
                                "scope": "#/properties/commonProp2"
                              },
                              {
                                "type": "Group",
                                "scope": "#/properties/categoryCOnV1Select",
                                "label": "Configuration",
                                "rule": {
                                  "effect": "SHOW",
                                  "condition": {
                                    "scope": "#/properties/commonProp2",
                                    "schema": {
                                      "const": "categoryCV1"
                                    },
                                    "failWhenUndefined": true
                                  }
                                },
                                "elements": [
                                  {
                                    "type": "Control",
                                    "scope": "#/properties/categoryCOnV1Select/properties/categoryCV1Prop1"
                                  },
                                  {
                                    "type": "Control",
                                    "scope": "#/properties/categoryCOnV1Select/properties/categoryCV1Prop2"
                                  },
                                  {
                                    "type": "Control",
                                    "scope": "#/properties/categoryCOnV1Select/properties/categoryCV1Prop3"
                                  }
                                ]
                              },
                              {
                                "type": "Control",
                                "scope": "#/properties/categoryCOnV2Select",
                                "label": "Configuration",
                                "rule": {
                                  "effect": "SHOW",
                                  "condition": {
                                    "scope": "#/properties/commonProp2",
                                    "schema": {
                                      "const": "categoryCV2"
                                    },
                                    "failWhenUndefined": true
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const CONFIG_KEY_BY_BEAN_NAME = {
    job: {
      "categoryBV1": "categoryBOnV1Select"
    },
    reader: {
      "categoryCV1": "categoryCOnV1Select",
      "categoryCV2": "categoryCOnV2Select"
    }
  }

  const renderers = [
    ...materialRenderers,
    // { tester: httpApiTester, renderer: HttpApiRenderer }
  ];

  const handleChange = ({ errors, data }) => {
    console.log("Form data and errors", data, errors);
    // setFormErrors(errors);


    ['categoryb', 'categoryb'].forEach(type => {
      const configKey = `${type}Config`;
      if (data[configKey]?.components) {
        data[configKey].components.forEach(c => c.config = c[CONFIG_KEY_BY_BEAN_NAME[type][c.commonProp2]]);
      }
    });

    setFormData(data);
  };



  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <CssBaseline />
        <GlobalStyles />

        <div className="App">
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={formData}
              renderers={renderers}
              cells={materialCells}
              onChange={handleChange}
            />
        </div>
      </ThemeProvider>
    </StyledEngineProvider >
  );
}

export default App;
