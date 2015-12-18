//			var data = {
//				"a":4,
//				"b":[
//					1,
//					2,
//					[
//						[1,2,3],
//						true,
//						{
//							"a":{
//								"b":[1,2,3,4,5,6]
//							}
//						}
//					],
//					4
//				],
//				"c":false,
//				"d":{
//					"a":1,
//					"b":"b",
//					"c":null
//				}
//			}
var data = {
  "property_trees": {
    "community_map": [
      {
        "k": "com_type",
        "input": "enum",
        "required": true,
        "v": {
          "Academic Building": {},
          "Airport": {},
          "Apartment Complex": {},
          "Bus Station": {},
          "Business Campus": {},
          "Campground": {},
          "Casino": {},
          "College Campus Building": {},
          "Convention Center": {},
          "Dormitory": {},
          "Government": {},
          "High School": {},
          "Hospital": {},
          "Hotel": {},
          "Industry": {},
          "Library": {},
          "Metro Station": {},
          "Museum": {},
          "Other": {},
          "Parking Garage": {},
          "Religious Building": {},
          "Retail": {},
          "School": {},
          "Shopping Center": {},
          "Shopping Mall": {},
          "Sports Center": {},
          "Stadium": {},
          "Theater": {},
          "Theme Park": {},
          "Train Station": {},
          "Urban Park": {}
        }
      },
      {
        "k": "name",
        "input": "text",
        "has_lang": true,
        "required": true
      },
      {
        "k": "default_lang",
        "input": "named_key",
        "name": "lang",
        "required": true
      },
      {
        "k": "post address",
        "input": "named_group"
      },
      {
        "k": "theme_map",
        "input": "text",
        "has_lang": false
      }
    ],
    "community_entity": [
      {
        "k": "name",
        "input": "text",
        "has_lang": true,
        "required": true
      },
      {
        "k": "entity1",
        "input": "named_group"
      },
      {
        "k": "entity2",
        "input": "named_group"
      }
    ],
    "drawing": [
      {
        "k": "map_type",
        "input": "enum",
        "required": true,
        "v": {
          "Airport": {},
          "Airport Terminal": {},
          "Casino": {},
          "College Building": {},
          "College Campus": {},
          "Convention": {},
          "Hospital": {},
          "Retail": {},
          "School Building": {},
          "School Campus": {},
          "Shopping Mall": {},
          "Station": {}
        }
      },
      {
        "k": "name",
        "input": "text",
        "required": true,
        "has_lang": true
      }
    ],
    "level": [
      {
        "k": "name",
        "desc": "This is the full name of the level. If it is longer than TBD characters a short name should also be added.",
        "input": "text",
        "required": true,
        "has_lang": false
      },
      {
        "k": "short name",
        "desc": "This is a short name for the level. It is used if the full name is longer than TBD characters.",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "elev_m",
        "input": "text"
      },
      {
        "k": "elev_rel_m",
        "input": "text"
      },
      {
        "k": "type",
        "input": "enum",
        "required": true,
        "v": {
          "indoor": {},
          "outdoor": {}
        }
      }
    ],
    "geometry": [
      {
        "k": "geom_type",
        "input": "multikey",
        "required": true,
        "ks": [
          {
            "k": "area",
            "desc": "This represents an area. There are alternate keys representing also representing specific types of areas.",
            "input": "enum",
            "v": {
              "aisle": {},
              "baggage claim": {
                "desc": "This is the area where baggage is retrieved. It should not be confused with a baggage carousel."
              },
              "copy/print": {},
              "immigration and customs": {},
              "meeting point": {},
              "parcel": {},
              "passport control": {},
              "pet relief area": {},
              "rest area": {},
              "section": {},
              "security section": {},
              "smoke": {},
              "true": {
                "desc": "This field represents a generic area."
              }
            }
          },
          {
            "k": "barrier",
            "input": "enum",
            "v": {
              "fence": {},
              "gate": {},
              "obstruction": {},
              "railing": {}
            }
          },
          {
            "k": "equipement",
            "desc": "This represents machinery, either fixed like a heater or portable like a computer.",
            "input": "enum",
            "v": {
              "cash register": {},
              "computer": {},
              "printer": {},
              "copy machine": {},
              "water heater": {},
              "true": {
                "desc": "This represents a generic machine."
              }
            }
          },
          {
            "k": "facility",
            "desc": "This object represents the objects that construct a building. It can include physical objects like a wall or areas like a room.",
            "input": "enum",
            "v": {
              "bathroom": {
                "desc": "A bathroom can have the gender property specified. Alternatively, the gender unspecified should represent both bathrooms. It can alternatively be used for the case of unisex bathroom in cases where the label unisex is obvious.",
                "ks": [
                  {
                    "k": "gender",
                    "input": "enum",
                    "v": {
                      "female": {},
                      "male": {},
                      "unisex": {
                        "desc": "This is for a bathroom for both genders."
                      },
                      "family": {
                        "desc": "This is for an explicitly classified family bathroom."
                      }
                    }
                  },
                  {
                    "k": "changing station",
                    "input": "boolean"
                  },
                  {
                    "k": "disabled access",
                    "input": "boolean"
                  },
                  {
                    "k": "as room",
                    "desc": "This is appended to a bathroom when it is mapped as a room object instead of as a unit",
                    "input": "boolean"
                  }
                ]
              },
              "column": {},
              "door": {},
              "doorway": {
                "desc": "This is the open space in the wall where a door goes when plotted as an area. In the case of a line format wall, this doorway may be omitted if a door is present."
              },
              "elevator": {
                "desc": "This represents a single elevator."
              },
              "elevator bank": {
                "desc": "This represents a collection of elevators. It can be used instead of drawing multiple elevators."
              },
              "escalator": {
                "ks": [
                  {
                    "k": "to",
                    "input": "enum",
                    "v": {
                      "up": {},
                      "down": {},
                      "both": {}
                    }
                  },
                  {
                    "k": "from",
                    "input": "enum",
                    "v": {
                      "up": {},
                      "down": {},
                      "both": {}
                    }
                  }
                ]
              },
              "floor opening": {},
              "hallway": {
                "ks": [
                  {
                    "k": "vestibule",
                    "desc": "This flag can be added to the portion of a hallway that forms a vestibule.",
                    "input": "boolean"
                  }
                ]
              },
              "hall area": {
                "desc": "This is a large open area of hallway, not included intersections."
              },
              "inaccessible space": {},
              "opening": {
                "desc": "This is used to illustrate an entrance on objects without doorways, such as an escalator or ramp"
              },
              "patio": {},
              "ramp": {
                "ks": [
                  {
                    "k": "disabled access",
                    "input": "boolean"
                  }
                ]
              },
              "room": {
                "ks": [
                  {
                    "k": "use",
                    "input": "enum",
                    "v": {
                      "lost and found": {},
                      "meditation room": {},
                      "auditorium": {},
                      "cafeteria": {},
                      "classroom": {},
                      "conference room": {},
                      "lab": {},
                      "library": {},
                      "locker room": {},
                      "lobby": {},
                      "office": {}
                    }
                  },
                  {
                    "k": "changing station",
                    "input": "boolean"
                  }
                ]
              },
              "stairs": {
                "desc": "This represents a stairs object. It will typically be rendered with an icon."
              },
              "stairwell": {
                "desc": "This is the room that houses a stairway. It is typically rendered without an icon."
              },
              "step": {
                "desc": "This represents a single step on a stairway."
              },
              "unit": {
                "ks": [
                  {
                    "k": "class",
                    "desc": "This represents a type of unit. As soon as entity categorization is fully used, this designation will be used only for units with a specific purpose. Several entries will be removed.",
                    "input": "enum",
                    "v": {
                      "car rental": {},
                      "cocktails": {},
                      "coffee": {},
                      "fitness center": {},
                      "food and drink": {},
                      "gym": {},
                      "money changer": {},
                      "movie theatre": {},
                      "restaurant": {},
                      "retail": {},
                      "shoe shine": {},
                      "ticketing, check-in": {},
                      "transit hotel": {}
                    }
                  },
                  {
                    "k": "use",
                    "input": "enum",
                    "v": {
                      "information": {},
                      "customer service": {},
                      "medical": {},
                      "police/security": {}
                    }
                  }
                ]
              },
              "wall": {},
              "window": {},
              "window opening": {
                "desc": "This is the hole in the wall where a window goes."
              },
              "moving walkway": {
                "ks": [
                  {
                    "k": "to",
                    "input": "boolean"
                  },
                  {
                    "k": "from",
                    "input": "boolean"
                  }
                ]
              },
              "element": {
                "desc": "This is a generic building element object, like a wall or door (although they have their own classifications)."
              },
              "area": {
                "desc": "This is a generic area in a building, simliar to a room or hallway."
              },
              "detail": {
                "desc": "This is a generic detail or contents layer object in a building, like a step."
              }
            }
          },
          {
            "k": "fixture",
            "desc": "This is a fixed object, or else one that is heavy and difficult to move.",
            "input": "enum",
            "v": {
              "baggage carousel": {
                "desc": "This represents the baggae carousel fixture."
              },
              "bin": {
                "desc": "This represents a bin that is a fixture."
              },
              "booth": {},
              "checkout": {},
              "kiosk": {},
              "rack": {
                "desc": "This represents a rack that is a fixture."
              },
              "ramp": {
                "ks": [
                  {
                    "k": "disabled access",
                    "input": "boolean"
                  }
                ]
              },
              "shelf": {
                "desc": "This represents a shelf that is a fixture."
              },
              "stage": {},
              "true": {
                "desc": "This represents a generic fixture"
              }
            }
          },
          {
            "k": "furnishing",
            "desc": "This represents a movable ojbect, like furniture.",
            "input": "enum",
            "v": {
              "bin": {
                "desc": "This represents a bin that is a furnishing."
              },
              "seat": {
                "ks": [
                  {
                    "k": "disabled access",
                    "input": "boolean"
                  }
                ]
              },
              "shelf": {
                "desc": "This represents a shelf that is a furnishing."
              },
              "table": {},
              "true": {
                "desc": "This represents a generic furnishing."
              }
            }
          },
          {
            "k": "marker",
            "desc": "This represents a marker. It can be either physical, like a traffic line, or nonphysical, like a text label.",
            "input": "enum",
            "v": {
              "disabled access": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed",
                    "fixed_value": "true"
                  }
                ]
              },
              "entrance": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed",
                    "fixed_value": "true"
                  }
                ]
              },
              "large text": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed",
                    "fixed_value": "true"
                  }
                ]
              },
              "small text": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed",
                    "fixed_value": "true"
                  }
                ]
              },
              "traffic marker": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed"
                  }
                ]
              },
              "true": {
                "ks": [
                  {
                    "k": "nonphysical",
                    "input": "fixed",
                    "fixed_value": "true"
                  }
                ]
              }
            },
            "ks": [
              {
                "k": "nonphysical",
                "input": "boolean"
              }
            ]
          },
          {
            "k": "meta",
            "desc": "This represents a meta data object. It is not a part of the map.",
            "input": "enum",
            "v": {
              "coordinates": {
                "ks": [
                  {
                    "k": "external_ref_object",
                    "input": "named_group"
                  }
                ]
              },
              "source": {
                "ks": [
                  {
                    "k": "external_ref_object",
                    "input": "named_group"
                  }
                ]
              },
              "guide": {
                "k": "publish",
                "input": "fixed",
                "fixed_value": "false"
              },
              "level outline": {
                "k": "publish",
                "input": "fixed",
                "fixed_value": "false"
              },
              "ground intersect": {
                "k": "publish",
                "input": "fixed",
                "fixed_value": "false"
              }
            }
          },
          {
            "k": "object",
            "desc": "This is a generic object.",
            "input": "enum",
            "v": {
              "true": {},
              "invalid": {},
              "unknown": {}
            }
          },
          {
            "k": "recreation",
            "input": "enum",
            "v": {
              "athletic field": {
                "ks": [
                  {
                    "k": "sport",
                    "input": "enum",
                    "v": {
                      "baseball": {},
                      "basketball": {},
                      "cricket": {},
                      "field hockey": {},
                      "football": {},
                      "hockey": {},
                      "soccer": {},
                      "tennis": {}
                    }
                  },
                  {
                    "k": "surface",
                    "input": "enum",
                    "v": {
                      "grass": {},
                      "asphalt": {},
                      "concrete": {},
                      "clay": {},
                      "gravel": {},
                      "sand": {},
                      "dirt": {},
                      "rubber": {},
                      "artificial turf": {}
                    }
                  }
                ]
              },
              "playground": {}
            }
          },
          {
            "k": "safety",
            "desc": "This is a safety or emergency response service or object.",
            "input": "enum",
            "v": {
              "defibrillator": {},
              "emergency exit": {},
              "eyewash": {},
              "fire extinguisher": {},
              "fire hose": {},
              "fire pull": {},
              "first aid": {},
              "true": {
                "desc": "This is a generic safety object."
              }
            }
          },
          {
            "k": "service",
            "desc": "This is a service or amenity.",
            "input": "enum",
            "v": {
              "atm": {
                "ks": [
                  {
                    "k": "currency",
                    "input": "enum",
                    "v": {
                      "general": {},
                      "yen": {},
                      "dollar": {}
                    }
                  }
                ]
              },
              "bike rack": {},
              "changing station": {},
              "flight monitor": {},
              "locker": {},
              "luggage cart": {},
              "mail": {},
              "massage chair": {},
              "paid parking": {},
              "power": {},
              "showers": {},
              "santa": {},
              "stroller": {},
              "telephone": {},
              "tv": {},
              "valet parking": {},
              "vending machine": {},
              "wifi": {},
              "true": {
                "desc": "This is a generic service"
              }
            }
          },
          {
            "k": "sign",
            "input": "enum",
            "v": {
              "stop sign": {},
              "yield sign": {},
              "true": {
                "desc": "This is a generic sign."
              }
            }
          },
          {
            "k": "signal",
            "input": "enum",
            "v": {
              "traffic light": {},
              "true": {
                "desc": "This is a generic signal."
              }
            }
          },
          {
            "k": "structure",
            "desc": "This represents a building or other structure.",
            "input": "enum",
            "v": {
              "building": {
                "ks": [
                  {
                    "k": "levels",
                    "desc": "This is intended for unmapped buildings only, if the level count is available.",
                    "input": "text"
                  }
                ]
              },
              "parking structure": {
                "ks": [
                  {
                    "k": "levels",
                    "desc": "This is intended for unmapped buildings only, if the level count is available.",
                    "input": "text"
                  }
                ]
              },
              "subbuilding": {
                "desc": "This represents a part of a building which will be treated as an independent building."
              },
              "tent": {
                "desc": "This is intended for durable tents."
              },
              "true": {
                "desc": "This represents a generic structure."
              }
            }
          },
          {
            "k": "traffic",
            "input": "enum",
            "v": {
              "crosswalk": {},
              "parking lot": {},
              "parking spot": {
                "ks": [
                  {
                    "k": "disabled access",
                    "input": "boolean"
                  }
                ]
              },
              "railway": {},
              "railway rail": {},
              "railway tie": {},
              "road": {
                "ks": [
                  {
                    "k": "cat",
                    "input": "enum",
                    "v": {
                      "access road": {},
                      "alley": {},
                      "municipal road": {},
                      "parking access": {},
                      "service road": {},
                      "uncategorized": {}
                    }
                  },
                  {
                    "k": "one way",
                    "desc": "This is used for one way roads. The direction refers to the direction relative to the direction the road path is drawn. Applicable to line and linear area roads only.",
                    "input": "enum",
                    "v": {
                      "fwd": {},
                      "rev": {}
                    }
                  }
                ]
              },
              "road intersection": {
                "desc": "This is used at in intersection when area roads are drawn."
              },
              "walkway": {
                "ks": [
                  {
                    "k": "covered",
                    "input": "boolean"
                  }
                ]
              },
              "walkway intersection": {
                "desc": "This is used at in intersection when area walkways are drawn.",
                "ks": [
                  {
                    "k": "covered",
                    "input": "boolean"
                  }
                ]
              }
            }
          },
          {
            "k": "transit",
            "input": "enum",
            "v": {
              "bus": {},
              "ground transportation": {},
              "taxi": {},
              "train": {}
            }
          },
          {
            "k": "vegetation",
            "input": "enum",
            "v": {
              "earth": {},
              "garden": {},
              "grass": {},
              "greenery": {},
              "tree": {}
            }
          },
          {
            "k": "vehicle",
            "input": "enum",
            "v": {
              "airplane": {}
            }
          },
          {
            "k": "water",
            "input": "enum",
            "v": {
              "true": {}
            }
          }
        ]
      },
      {
        "k": "name",
        "input": "text",
        "has_lang": true
      },
      {
        "k": "short name",
        "input": "text",
        "has_lang": true
      },
      {
        "k": "style keys",
        "input": "named_group"
      },
      {
        "k": "info",
        "desc": "This is used to give an additional information on an object, such as the type of object when it is not included in the classification.",
        "input": "text",
        "has_lang": true
      }
    ],
    "entity": [
      {
        "k": "name",
        "input": "text",
        "has_lang": true,
        "required": true
      },
      {
        "k": "short name",
        "input": "text",
        "has_lang": true
      },
      {
        "k": "entity1",
        "input": "named_group"
      },
      {
        "k": "post address",
        "input": "named_group"
      },
      {
        "k": "entity2",
        "input": "named_group"
      },
      {
        "k": "location",
        "input": "text"
      },
      {
        "k": "category",
        "input": "text",
        "has_lang": true,
        "is_array": true,
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "tags",
        "input": "text",
        "has_lang": true,
        "is_array": true,
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "style keys",
        "input": "named_group"
      }
    ],
    "chain": [
      {
        "k": "name",
        "input": "text",
        "has_lang": true,
        "required": true
      },
      {
        "k": "short name",
        "input": "text",
        "has_lang": true
      },
      {
        "k": "entity1",
        "input": "named_group"
      }
    ],
    "link": [
      {
        "k": "nav_class",
        "input": "multikey",
        "required": true,
        "prop": {
          "linkType": "class"
        },
        "ks": [
          {
            "k": "aisle",
            "input": "enum",
            "v": {
              "major": {},
              "minor": {}
            }
          },
          {
            "k": "corridor",
            "input": "enum",
            "v": {
              "major": {},
              "minor": {}
            }
          },
          {
            "k": "entryway",
            "input": "boolean"
          },
          {
            "k": "level change",
            "input": "enum",
            "v": {
              "elevator": {},
              "escalator": {},
              "stairs": {},
              "ramp": {},
              "transition": {}
            }
          },
          {
            "k": "mechanical",
            "input": "enum",
            "v": {
              "moving walkway": {}
            }
          },
          {
            "k": "path",
            "input": "enum",
            "v": {
              "major": {},
              "minor": {}
            }
          },
          {
            "k": "traffic",
            "input": "enum",
            "v": {
              "parking lot": {},
              "shoulder": {},
              "street": {}
            }
          },
          {
            "k": "walkway",
            "input": "enum",
            "v": {
              "major": {},
              "minor": {}
            }
          }
        ]
      },
      {
        "k": "name",
        "input": "text",
        "has_lang": true,
        "prop": {
          "linkType": "class"
        }
      },
      {
        "k": "group",
        "input": "text",
        "prop": {
          "linkType": "class"
        }
      },
      {
        "k": "intersection",
        "input": "boolean",
        "prop": {
          "linkType": "class"
        }
      },
      {
        "k": "lanes",
        "input": "text"
      },
      {
        "k": "lane",
        "input": "text"
      },
      {
        "k": "lane_rev",
        "input": "boolean"
      },
      {
        "k": "crossing",
        "input": "boolean"
      },
      {
        "k": "diversion",
        "input": "boolean"
      },
      {
        "k": "start_to_image",
        "input": "text",
        "prop": {
          "linkType": "start",
          "reverse": "end_to_image"
        }
      },
      {
        "k": "start_from_image",
        "input": "text",
        "prop": {
          "linkType": "start",
          "reverse": "end_from_image"
        }
      },
      {
        "k": "end_to_image",
        "input": "text",
        "prop": {
          "linkType": "end",
          "reverse": "start_to_image"
        }
      },
      {
        "k": "end_from_image",
        "input": "text",
        "prop": {
          "linkType": "end",
          "reverse": "start_from_image"
        }
      },
      {
        "k": "start_to_desc",
        "input": "text",
        "prop": {
          "linkType": "start",
          "reverse": "end_to_desc"
        }
      },
      {
        "k": "start_from_desc",
        "input": "text",
        "prop": {
          "linkType": "start",
          "reverse": "end_from_desc"
        }
      },
      {
        "k": "end_to_desc",
        "input": "text",
        "prop": {
          "linkType": "end",
          "reverse": "start_to_desc"
        }
      },
      {
        "k": "end_from_desc",
        "input": "text",
        "prop": {
          "linkType": "end",
          "reverse": "start_from_desc"
        }
      }
    ],
    "node": [
      {
        "k": "name",
        "input": "text",
        "has_lang": true
      }
    ]
  },
  "named_groups": {
    "post address": [
      {
        "k": "country",
        "input": "enum",
        "v": {
          "AD": {},
          "AE": {},
          "AF": {},
          "AG": {},
          "AI": {},
          "AL": {},
          "AM": {},
          "AN": {},
          "AO": {},
          "AQ": {},
          "AR": {},
          "AS": {},
          "AT": {},
          "AU": {
            "ks": [
              {
                "k": "territory",
                "input": "enum",
                "v": {
                  "NSW": {},
                  "QLD": {},
                  "SA": {},
                  "TAS": {},
                  "VIC": {},
                  "WA": {}
                }
              },
              {
                "k": "main admin region",
                "input": "fixed"
              }
            ]
          },
          "AW": {},
          "AX": {},
          "AZ": {},
          "BA": {},
          "BB": {},
          "BD": {},
          "BE": {},
          "BF": {},
          "BG": {},
          "BH": {},
          "BI": {},
          "BJ": {},
          "BM": {},
          "BN": {},
          "BO": {},
          "BR": {},
          "BS": {},
          "BT": {},
          "BV": {},
          "BW": {},
          "BY": {},
          "BZ": {},
          "CA": {
            "ks": [
              {
                "k": "province",
                "input": "enum",
                "v": {
                  "AB": {},
                  "BC": {},
                  "MB": {},
                  "NB": {},
                  "NL": {},
                  "NS": {},
                  "ON": {},
                  "PE": {},
                  "QC": {},
                  "SK": {}
                }
              },
              {
                "k": "main admin region",
                "input": "fixed"
              }
            ]
          },
          "CC": {},
          "CD": {},
          "CF": {},
          "CG": {},
          "CH": {},
          "CI": {},
          "CK": {},
          "CL": {},
          "CM": {},
          "CN": {},
          "CO": {},
          "CR": {},
          "CV": {},
          "CX": {},
          "CY": {},
          "CZ": {},
          "DE": {},
          "DJ": {},
          "DK": {},
          "DM": {},
          "DO": {},
          "DZ": {},
          "EC": {},
          "EE": {},
          "EG": {},
          "EH": {},
          "ER": {},
          "ES": {},
          "ET": {},
          "FI": {},
          "FJ": {},
          "FK": {},
          "FM": {},
          "FO": {},
          "FR": {},
          "GA": {},
          "GB": {},
          "GD": {},
          "GE": {},
          "GF": {},
          "GH": {},
          "GI": {},
          "GL": {},
          "GM": {},
          "GN": {},
          "GP": {},
          "GQ": {},
          "GR": {},
          "GT": {},
          "GU": {},
          "GW": {},
          "GY": {},
          "HK": {},
          "HM": {},
          "HN": {},
          "HR": {},
          "HT": {},
          "HU": {},
          "ID": {},
          "IE": {},
          "IL": {},
          "IN": {},
          "IO": {},
          "IQ": {},
          "IS": {},
          "IT": {},
          "JM": {},
          "JO": {},
          "JP": {
            "ks": [
              {
                "k": "prefecture",
                "input": "enum",
                "v": {
                  "Aichi": {},
                  "Akita": {},
                  "Aomori": {},
                  "Chiba": {},
                  "Ehime": {},
                  "Fukui": {},
                  "Fukuoka": {},
                  "Fukushima": {},
                  "Gifu": {},
                  "Gunma": {},
                  "Hiroshima": {},
                  "Hokkaido": {},
                  "Hyōgo": {},
                  "Ibaraki": {},
                  "Ishikawa": {},
                  "Iwate": {},
                  "Kagawa": {},
                  "Kagoshima": {},
                  "Kanagawa": {},
                  "Kōchi": {},
                  "Kumamoto": {},
                  "Kyoto": {},
                  "Mie": {},
                  "Miyagi": {},
                  "Miyazaki": {},
                  "Nagano": {},
                  "Nagasaki": {},
                  "Nara": {},
                  "Niigata": {},
                  "Ōita": {},
                  "Okayama": {},
                  "Okinawa": {},
                  "Osaka": {},
                  "Saga": {},
                  "Saitama": {},
                  "Shiga": {},
                  "Shimane": {},
                  "Shizuoka": {},
                  "Tochigi": {},
                  "Tokushima": {},
                  "Tokyo": {},
                  "Tottori": {},
                  "Toyama": {},
                  "Wakayama": {},
                  "Yamagata": {},
                  "Yamaguchi": {},
                  "Yamanashi": {}
                }
              },
              {
                "k": "main admin region",
                "input": "fixed"
              }
            ]
          },
          "KE": {},
          "KG": {},
          "KH": {},
          "KI": {},
          "KM": {},
          "KN": {},
          "KR": {},
          "KW": {},
          "KY": {},
          "KZ": {},
          "LA": {},
          "LB": {},
          "LC": {},
          "LI": {},
          "LK": {},
          "LR": {},
          "LS": {},
          "LT": {},
          "LU": {},
          "LV": {},
          "LY": {},
          "MA": {},
          "MC": {},
          "MD": {},
          "MG": {},
          "MH": {},
          "MK": {},
          "ML": {},
          "MM": {},
          "MN": {},
          "MO": {},
          "MQ": {},
          "MR": {},
          "MS": {},
          "MT": {},
          "MU": {},
          "MV": {},
          "MW": {},
          "MX": {},
          "MY": {},
          "MZ": {},
          "NA": {},
          "NC": {},
          "NE": {},
          "NF": {},
          "NG": {},
          "NI": {},
          "NL": {},
          "NO": {},
          "NP": {},
          "NR": {},
          "NU": {},
          "NZ": {},
          "OM": {},
          "PA": {},
          "PE": {},
          "PF": {},
          "PG": {},
          "PH": {},
          "PK": {},
          "PL": {},
          "PM": {},
          "PN": {},
          "PR": {},
          "PS": {},
          "PT": {},
          "PW": {},
          "PY": {},
          "QA": {},
          "RE": {},
          "RO": {},
          "RU": {},
          "RW": {},
          "SA": {},
          "SB": {},
          "SC": {},
          "SE": {},
          "SG": {},
          "SH": {},
          "SI": {},
          "SJ": {},
          "SK": {},
          "SL": {},
          "SM": {},
          "SN": {},
          "SO": {},
          "SR": {},
          "ST": {},
          "SV": {},
          "SZ": {},
          "TC": {},
          "TD": {},
          "TF": {},
          "TG": {},
          "TH": {},
          "TJ": {},
          "TK": {},
          "TM": {},
          "TN": {},
          "TO": {},
          "TR": {},
          "TT": {},
          "TV": {},
          "TW": {},
          "TZ": {},
          "UA": {},
          "UG": {},
          "UM": {},
          "US": {
            "ks": [
              {
                "k": "state",
                "input": "enum",
                "v": {
                  "AK": {},
                  "AL": {},
                  "AR": {},
                  "AZ": {},
                  "CA": {},
                  "CO": {},
                  "CT": {},
                  "DC": {},
                  "DE": {},
                  "FL": {},
                  "GA": {},
                  "HI": {},
                  "IA": {},
                  "ID": {},
                  "IL": {},
                  "IN": {},
                  "KS": {},
                  "KY": {},
                  "LA": {},
                  "MA": {},
                  "MD": {},
                  "ME": {},
                  "MI": {},
                  "MN": {},
                  "MO": {},
                  "MS": {},
                  "MT": {},
                  "NC": {},
                  "ND": {},
                  "NE": {},
                  "NH": {},
                  "NJ": {},
                  "NM": {},
                  "NV": {},
                  "NY": {},
                  "OH": {},
                  "OK": {},
                  "OR": {},
                  "PA": {},
                  "RI": {},
                  "SC": {},
                  "SD": {},
                  "TN": {},
                  "TX": {},
                  "UT": {},
                  "VA": {},
                  "VT": {},
                  "WA": {},
                  "WI": {},
                  "WV": {},
                  "WY": {}
                }
              },
              {
                "k": "main admin region",
                "input": "fixed"
              }
            ]
          },
          "UY": {},
          "UZ": {},
          "VC": {},
          "VE": {},
          "VG": {},
          "VI": {},
          "VN": {},
          "VU": {},
          "WF": {},
          "WS": {},
          "YE": {},
          "YT": {},
          "ZA": {},
          "ZM": {},
          "ZW": {}
        }
      },
      {
        "k": "main admin region",
        "input": "multikey",
        "ks": [
          {
            "k": "state",
            "input": "text",
            "has_lang": true
          },
          {
            "k": "province",
            "input": "text",
            "has_lang": true
          },
          {
            "k": "prefecture",
            "input": "text",
            "has_lang": true
          },
          {
            "k": "territory",
            "input": "text",
            "has_lang": true
          }
        ]
      },
      {
        "k": "postal code",
        "input": "text"
      },
      {
        "k": "city",
        "input": "text",
        "has_lang": true
      },
      {
        "k": "street address",
        "input": "text",
        "has_lang": true
      }
    ],
    "names": [
      {
        "k": "name",
        "input": "named_key"
      },
      {
        "k": "short name",
        "input": "text",
        "has_lang": true
      }
    ],
    "entity1": [
      {
        "k": "phone",
        "input": "text",
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "email",
        "input": "text",
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "url",
        "input": "text",
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "fax",
        "input": "text",
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "description",
        "input": "text",
        "has_lang": true,
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "naics",
        "input": "text",
        "is_array": true,
        "prop": {
          "detail": "true"
        }
      }
    ],
    "entity2": [
      {
        "k": "hours",
        "input": "text",
        "has_lang": true,
        "prop": {
          "detail": "true"
        }
      },
      {
        "k": "storeid",
        "input": "text"
      },
      {
        "k": "prop_owner",
        "input": "text"
      },
      {
        "k": "product",
        "input": "text",
        "has_lang": true,
        "prop": {
          "detail": "true"
        }
      }
    ],
    "style keys": [
      {
        "k": "$icon",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$style",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$image_url",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$label_text",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$body_color",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$outline_color",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$outline_width",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "$text_color",
        "input": "text",
        "has_lang": false
      }
    ],
    "external_ref_object": [
      {
        "k": "ref",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "xscale",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "yscale",
        "input": "text",
        "has_lang": false
      },
      {
        "k": "units",
        "input": "enum",
        "v": {
          "m": {},
          "km": {},
          "cm": {},
          "ft": {},
          "yd": {},
          "in": {},
          "mile": {}
        }
      },
      {
        "k": "publish",
        "input": "boolean"
      }
    ]
  },
  "named_keys": {
    "address keys": {
      "k": "address keys",
      "input": "enum",
      "v": {
        "$id": {},
        "Booth": {},
        "Gate": {},
        "Meeting Room": {},
        "Unit": {},
        "#": {},
        "Section": {},
        "Space": {},
        "Region": {},
        "Zone": {},
        "Area": {},
        "Field": {},
        "Level": {},
        "Stair": {},
        "Escalator": {},
        "Elevator": {},
        "Door": {},
        "Ramp": {},
        "Cubicle": {},
        "Office": {},
        "Bathroom": {},
        "Entrance": {},
        "Store": {},
        "Apartment": {},
        "Apt": {},
        "Room": {},
        "Rm": {},
        "Suite": {},
        "Terminal": {},
        "Concourse": {},
        "Hanger": {},
        "Hall": {},
        "Aisle": {},
        "Shelf": {},
        "Bin": {},
        "Department": {},
        "Rack": {},
        "End Cap": {},
        "Display": {},
        "Row": {},
        "Box": {},
        "Seat": {},
        "Concession": {},
        "Locker": {},
        "Desk": {},
        "Chair": {},
        "Street": {},
        "Road": {},
        "Zip Code": {},
        "City": {},
        "Neighborhood": {},
        "Address": {},
        "Address 2": {},
        "State": {},
        "Country": {},
        "Exhibit": {},
        "Painting": {},
        "Sculpture": {},
        "Lane": {},
        "Exit": {},
        "Intersection": {},
        "Lot": {},
        "Mall": {},
        "Building": {},
        "Moving Walkway": {}
      }
    },
    "lang": {
      "k": "lang",
      "input": "enum",
      "v": {
        "en": {},
        "ja": {},
        "zh": {},
        "de": {},
        "fr": {},
        "es": {},
        "it": {},
        "ar": {},
        "da": {},
        "he": {},
        "hi": {},
        "id": {},
        "ko": {},
        "nl": {},
        "pt": {},
        "ro": {},
        "sv": {},
        "ru": {},
        "tr": {},
        "gu": {},
        "pl": {},
        "cs": {},
        "sk": {}
      }
    },
    "icon": {
      "k": "icon",
      "input": "enum",
      "v": {
        "Cash Register": {},
        "Crosswalk": {},
        "Customs": {},
        "Immigration and Customs": {},
        "Meeting Point": {},
        "Pet Relief Area": {},
        "Playground": {},
        "Rest Area": {},
        "Security Section": {},
        "Smoke": {},
        "Baggage Claim": {},
        "Bathroom W": {},
        "Bathroom M": {},
        "Bathroom Fam": {},
        "Bathroom": {},
        "Bathroom W DA": {},
        "Bathroom M DA": {},
        "Bathroom Fam DA": {},
        "Bathroom DA": {},
        "Elevator": {},
        "Emergency Exit": {},
        "Escalator": {},
        "Moving Walkway": {},
        "Lost and Found": {},
        "Meditation Room": {},
        "Defibrillator": {},
        "Eyewash": {},
        "Fire Extinguisher": {},
        "Fire Hose": {},
        "Fire Pull": {},
        "First Aid": {},
        "ATM": {},
        "ATM:General": {},
        "ATM:Yen": {},
        "Flight Monitor": {},
        "Luggage Cart": {},
        "Mail": {},
        "Massage Chair": {},
        "Power": {},
        "Telephone": {},
        "TV": {},
        "Valet Parking": {},
        "Vending Machine": {},
        "Wifi": {},
        "Shower": {},
        "Stop Sign": {},
        "Yield Sign": {},
        "Traffic Light": {},
        "Stairs": {},
        "Bus": {},
        "Ground Transportation": {},
        "Taxi": {},
        "Train": {},
        "Car Rental": {},
        "Cocktails": {},
        "Coffee": {},
        "Fitness Center": {},
        "Food and Drink": {},
        "Money Changer": {},
        "Movie Theater": {},
        "Restaurant": {},
        "Santa": {},
        "Shoe Shine": {},
        "Ticketing, Check-in": {},
        "Transit Hotel": {},
        "Gym": {},
        "Information": {},
        "Customer Service": {},
        "Medical": {},
        "Police/Security": {},
        "Disabled Access": {},
        "Wheelchair Ramp": {},
        "Parking": {},
        "Paid Parking": {},
        "Changing Station": {},
        "Stroller": {},
        "Copy/Print": {},
        "Locker": {},
        "Passport Control": {},
        "Bike Rack": {}
      }
    }
  }
}

