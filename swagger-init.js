
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "My API",
      "version": "1.0.0",
      "description": "API Documentation"
    },
    "servers": [
      {
        "url": "/",
        "description": "Same origin as Swagger UI"
      },
      {
        "url": "http://localhost:3000",
        "description": "Local dev"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "paths": {
      "/api/adverts": {
        "post": {
          "summary": "Create an advert (linked to a car or standalone)",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "title"
                  ],
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "car": {
                      "type": "string",
                      "description": "Optional: link to an existing car the user owns"
                    },
                    "make": {
                      "type": "string"
                    },
                    "model": {
                      "type": "string"
                    },
                    "year": {
                      "type": "number"
                    },
                    "price": {
                      "type": "number"
                    },
                    "contactPhone": {
                      "type": "string"
                    },
                    "priority": {
                      "type": "number",
                      "description": "Higher = displayed first while priorityUntil is in the future"
                    },
                    "priorityUntil": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "startsAt": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "expiresAt": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "draft",
                        "active",
                        "paused",
                        "expired"
                      ]
                    },
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Advert created"
            }
          }
        },
        "get": {
          "summary": "List adverts (sorted by effective priority, then recency)",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "status",
              "schema": {
                "type": "string",
                "default": "active"
              }
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Adverts list"
            }
          }
        }
      },
      "/api/adverts/featured": {
        "get": {
          "summary": "List adverts whose priority boost is currently active",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 5
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Featured adverts"
            }
          }
        }
      },
      "/api/adverts/user/{userId}": {
        "get": {
          "summary": "List a user's adverts",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User's adverts"
            }
          }
        }
      },
      "/api/adverts/{id}": {
        "get": {
          "summary": "Get a single advert (also increments view count)",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Advert detail"
            }
          }
        },
        "put": {
          "summary": "Update an advert (owner only). New images are appended.",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "car": {
                      "type": "string"
                    },
                    "make": {
                      "type": "string"
                    },
                    "model": {
                      "type": "string"
                    },
                    "year": {
                      "type": "number"
                    },
                    "price": {
                      "type": "number"
                    },
                    "contactPhone": {
                      "type": "string"
                    },
                    "priority": {
                      "type": "number"
                    },
                    "priorityUntil": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "startsAt": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "expiresAt": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "draft",
                        "active",
                        "paused",
                        "expired"
                      ]
                    },
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Advert updated"
            }
          }
        },
        "delete": {
          "summary": "Delete an advert (owner only)",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Advert deleted"
            }
          }
        }
      },
      "/api/adverts/all": {
        "delete": {
          "summary": "Delete every advert in the system (admin / super_admin only)",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "All adverts deleted"
            },
            "403": {
              "description": "Insufficient permissions"
            }
          }
        }
      },
      "/api/adverts/{id}/priority": {
        "post": {
          "summary": "Set or refresh an advert's priority boost",
          "description": "Pass either priorityUntil (absolute) or durationDays (relative). Boost ends automatically.",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "priority": {
                      "type": "number",
                      "example": 10
                    },
                    "priorityUntil": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "durationDays": {
                      "type": "number",
                      "example": 7
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Priority updated"
            }
          }
        }
      },
      "/api/adverts/{id}/click": {
        "post": {
          "summary": "Track an advert click",
          "tags": [
            "Adverts"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Click tracked"
            }
          }
        }
      },
      "/api/bookings": {
        "post": {
          "summary": "Create a rental booking for a car",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "carId",
                    "startDate",
                    "endDate"
                  ],
                  "properties": {
                    "carId": {
                      "type": "string"
                    },
                    "startDate": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "endDate": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "notes": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Booking created (car populated)"
            },
            "400": {
              "description": "Validation error or date overlap"
            },
            "404": {
              "description": "Car not found"
            }
          }
        },
        "get": {
          "summary": "List the authenticated user's bookings",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "status",
              "schema": {
                "type": "string",
                "enum": [
                  "pending",
                  "active",
                  "completed",
                  "cancelled"
                ]
              },
              "description": "Filter by derived status"
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Bookings list with car details populated"
            }
          }
        }
      },
      "/api/bookings/stats": {
        "get": {
          "summary": "Activity summary for the authenticated user",
          "description": "Returns counts per status (pending / active / completed / cancelled) plus total and total spent on completed bookings.\n",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "{ total, pending, active, completed, cancelled, totalSpent }\n"
            }
          }
        }
      },
      "/api/bookings/{id}/cancel": {
        "post": {
          "summary": "Cancel a booking (only pending or active)",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "reason": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Booking cancelled"
            },
            "400": {
              "description": "Already cancelled or completed"
            },
            "404": {
              "description": "Not found"
            }
          }
        }
      },
      "/api/bookings/{id}": {
        "get": {
          "summary": "Get a single booking (owner only)",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Booking with car populated"
            }
          }
        },
        "put": {
          "summary": "Update a booking's dates or notes (only pending or active)",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "startDate": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "endDate": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "notes": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Booking updated"
            },
            "400": {
              "description": "Cancelled/completed, validation, or overlap"
            }
          }
        },
        "delete": {
          "summary": "Hard-delete a booking from history",
          "tags": [
            "Bookings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Booking deleted"
            }
          }
        }
      },
      "/api/cars": {
        "post": {
          "summary": "Create new car (for sale/rent/normal) with images, docs and specs",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "make": {
                      "type": "string"
                    },
                    "model": {
                      "type": "string"
                    },
                    "year": {
                      "type": "number"
                    },
                    "vin": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "rentalPrice": {
                      "type": "number"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "available",
                        "parked",
                        "rented",
                        "sold"
                      ]
                    },
                    "forSale": {
                      "type": "boolean"
                    },
                    "forRent": {
                      "type": "boolean"
                    },
                    "inGarage": {
                      "type": "boolean"
                    },
                    "fuelType": {
                      "type": "string",
                      "enum": [
                        "petrol",
                        "diesel",
                        "electric",
                        "hybrid",
                        "lpg",
                        "cng",
                        "other"
                      ]
                    },
                    "transmission": {
                      "type": "string",
                      "enum": [
                        "manual",
                        "automatic"
                      ]
                    },
                    "color": {
                      "type": "string"
                    },
                    "bodyType": {
                      "type": "string"
                    },
                    "mileage": {
                      "type": "number"
                    },
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    },
                    "carteGrise": {
                      "type": "string",
                      "format": "binary",
                      "description": "Vehicle registration document (image or PDF)"
                    },
                    "customerDocument": {
                      "type": "string",
                      "format": "binary",
                      "description": "Customer document (image or PDF)"
                    },
                    "salesCertificate": {
                      "type": "string",
                      "format": "binary",
                      "description": "Sales certificate (image or PDF)"
                    },
                    "idCardFront": {
                      "type": "string",
                      "format": "binary",
                      "description": "Owner ID card front. Falls back to the user's profile if omitted."
                    },
                    "idCardBack": {
                      "type": "string",
                      "format": "binary",
                      "description": "Owner ID card back. Falls back to the user's profile if omitted."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Car created"
            }
          }
        }
      },
      "/api/cars/park": {
        "post": {
          "summary": "Park/keep car in garage with images",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "make": {
                      "type": "string"
                    },
                    "model": {
                      "type": "string"
                    },
                    "year": {
                      "type": "number"
                    },
                    "vin": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Car parked with images"
            }
          }
        }
      },
      "/api/cars/collect/{id}": {
        "post": {
          "summary": "Collect car from garage",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Car collected"
            }
          }
        }
      },
      "/api/cars/buy/{id}": {
        "post": {
          "summary": "Buy available car for sale",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Car bought"
            }
          }
        }
      },
      "/api/cars/sell/{id}": {
        "post": {
          "summary": "Put owned car for sale (set price)",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "price": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Car listed for sale"
            }
          }
        }
      },
      "/api/cars/rent/{id}": {
        "post": {
          "summary": "Rent available car",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Car rented"
            }
          }
        }
      },
      "/api/cars/rent-list/{id}": {
        "post": {
          "summary": "List owned car for rent",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "rentalPrice": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Car listed for rent"
            }
          }
        }
      },
      "/api/cars/{id}": {
        "put": {
          "summary": "Update owned car (multipart — new images appended, new docs replace old)",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "make": {
                      "type": "string"
                    },
                    "model": {
                      "type": "string"
                    },
                    "year": {
                      "type": "number"
                    },
                    "description": {
                      "type": "string"
                    },
                    "price": {
                      "type": "number"
                    },
                    "rentalPrice": {
                      "type": "number"
                    },
                    "fuelType": {
                      "type": "string",
                      "enum": [
                        "petrol",
                        "diesel",
                        "electric",
                        "hybrid",
                        "lpg",
                        "cng",
                        "other"
                      ]
                    },
                    "transmission": {
                      "type": "string",
                      "enum": [
                        "manual",
                        "automatic"
                      ]
                    },
                    "color": {
                      "type": "string"
                    },
                    "bodyType": {
                      "type": "string"
                    },
                    "mileage": {
                      "type": "number"
                    },
                    "images": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "format": "binary"
                      }
                    },
                    "carteGrise": {
                      "type": "string",
                      "format": "binary"
                    },
                    "customerDocument": {
                      "type": "string",
                      "format": "binary"
                    },
                    "salesCertificate": {
                      "type": "string",
                      "format": "binary"
                    },
                    "idCardFront": {
                      "type": "string",
                      "format": "binary"
                    },
                    "idCardBack": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Car updated"
            }
          }
        },
        "delete": {
          "summary": "Delete owned car",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Car deleted"
            }
          }
        }
      },
      "/api/cars/{id}/verify": {
        "post": {
          "summary": "Set a car's verified, flagged and/or premiumVerified state (admin / super_admin only)",
          "description": "Body must include at least one of \"verified\", \"flagged\", \"premiumVerified\".\n\"verified\": \"verified\"  → verified=verified, flagged=false\n\"verified\": \"unverified\" → verified=unverified, flagged unchanged\n\"verified\": \"flagged\"   → verified=unverified, flagged=true\n\"flagged\": true|false   → sets flagged only, leaves verified alone\n\"premiumVerified\": true|false → sets the premium badge independently\nAny combination of the three keys can be sent together.\n",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "verified": {
                      "type": "string",
                      "enum": [
                        "verified",
                        "unverified",
                        "flagged"
                      ]
                    },
                    "flagged": {
                      "type": "boolean"
                    },
                    "premiumVerified": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Verification state set"
            },
            "400": {
              "description": "Missing or invalid value"
            },
            "403": {
              "description": "Insufficient permissions"
            },
            "404": {
              "description": "Car not found"
            }
          }
        }
      },
      "/api/cars/verify-all": {
        "post": {
          "summary": "[TEMPORARY — testing only, no auth] Bulk-verify every car in the database.\nSets verified='verified' and flagged=false on all cars.\nRemove this endpoint before going live.\n",
          "tags": [
            "Cars"
          ],
          "responses": {
            "200": {
              "description": "All cars marked verified"
            }
          }
        }
      },
      "/api/cars/promote-phone/{phone}": {
        "post": {
          "summary": "[One-off] Marks every car owned by the user with this phone as premiumVerified=true.\nIdempotent. No auth (dev helper).\n",
          "tags": [
            "Cars"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "phone",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Cars promoted"
            },
            "404": {
              "description": "No user with that phone"
            }
          }
        }
      },
      "/api/cars/{id}/premium": {
        "post": {
          "summary": "Set or unset a car's premiumVerified badge (admin / super_admin only).\nSame endpoint flips both ways via the body.\n",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "premiumVerified"
                  ],
                  "properties": {
                    "premiumVerified": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "premiumVerified set"
            },
            "400": {
              "description": "Missing or invalid premiumVerified value"
            },
            "403": {
              "description": "Insufficient permissions"
            },
            "404": {
              "description": "Car not found"
            }
          }
        }
      },
      "/api/cars/user/{userId}/sale": {
        "get": {
          "summary": "List user's cars for sale (supports filtering)",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "make",
              "schema": {
                "type": "string"
              },
              "description": "Case-insensitive partial match (e.g. \"bmw\" matches \"BMW\")"
            },
            {
              "in": "query",
              "name": "model",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "year",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "q",
              "schema": {
                "type": "string"
              },
              "description": "Free-text search across make, model, description"
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User's sale cars"
            }
          }
        }
      },
      "/api/cars/user/{userId}/rent": {
        "get": {
          "summary": "List user's cars for rent (supports filtering)",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "make",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "model",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "year",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "q",
              "schema": {
                "type": "string"
              },
              "description": "Free-text search across make, model, description"
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User's rent cars"
            }
          }
        }
      },
      "/api/cars/available": {
        "get": {
          "summary": "List available cars (for sale/rent) with filtering",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "status",
              "schema": {
                "type": "string",
                "example": "available"
              }
            },
            {
              "in": "query",
              "name": "forSale",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "in": "query",
              "name": "forRent",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "in": "query",
              "name": "make",
              "schema": {
                "type": "string"
              },
              "description": "Case-insensitive partial match (e.g. \"bmw\" matches \"BMW\")"
            },
            {
              "in": "query",
              "name": "model",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "year",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "q",
              "schema": {
                "type": "string"
              },
              "description": "Free-text search across make, model, description"
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of available cars"
            }
          }
        }
      },
      "/api/cars/search": {
        "get": {
          "summary": "Search cars (text + faceted filters, returns facet counts for dropdown UIs)",
          "description": "Returns matching cars plus a `facets` object listing distinct makes, models and years present in the result set. Use `q` for free-text search (e.g. \"toyota\"), and `make`/`model` (comma-separated for multi-select) for dropdown-driven narrowing.\n",
          "tags": [
            "Cars"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "q",
              "schema": {
                "type": "string"
              },
              "description": "Free-text — matches make, model or description (case-insensitive partial)"
            },
            {
              "in": "query",
              "name": "make",
              "schema": {
                "type": "string"
              },
              "description": "Exact make(s). Comma-separate for multi-select, e.g. \"Toyota,Honda\""
            },
            {
              "in": "query",
              "name": "model",
              "schema": {
                "type": "string"
              },
              "description": "Exact model(s). Comma-separated supported."
            },
            {
              "in": "query",
              "name": "status",
              "schema": {
                "type": "string"
              },
              "description": "Comma-separated list, e.g. \"available,rented\""
            },
            {
              "in": "query",
              "name": "forSale",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "in": "query",
              "name": "forRent",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "in": "query",
              "name": "yearMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "yearMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMin",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "priceMax",
              "schema": {
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "sort",
              "schema": {
                "type": "string",
                "enum": [
                  "recent",
                  "priceAsc",
                  "priceDesc",
                  "yearAsc",
                  "yearDesc"
                ],
                "default": "recent"
              }
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 20
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Shape: { success, data: Car[], facets: { makes: [{make, count}], models: [{make, model, count}], years: [{year, count}] }, pagination }\n"
            }
          }
        }
      },
      "/api/cars/home": {
        "get": {
          "summary": "Cars for the home page (premiumVerified=true, available only)",
          "description": "Curated listings. Only premium-verified cars surface here. Supports the\nsame filter params as /search (make, model, year, price ranges, q).\n",
          "tags": [
            "Cars"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Premium car list"
            }
          }
        }
      },
      "/api/cars/marketplace": {
        "get": {
          "summary": "Cars for the marketplace (premiumVerified=false, available only)",
          "description": "The general marketplace listing. Excludes premium-verified cars,\nwhich live in /home. Supports the same filter params as /search.\n",
          "tags": [
            "Cars"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Marketplace car list"
            }
          }
        }
      },
      "/api/ratings/{sellerId}/summary": {
        "get": {
          "summary": "Aggregate rating for a seller — average, count, per-star breakdown",
          "tags": [
            "Ratings"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "sellerId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "{ average: 4.3, count: 27, breakdown: { 1: 1, 2: 0, 3: 5, 4: 10, 5: 11 } }\n"
            }
          }
        }
      },
      "/api/ratings/{sellerId}/me": {
        "get": {
          "summary": "The authenticated user's own rating of this seller (null if not rated yet)",
          "tags": [
            "Ratings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "sellerId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Rating record or null"
            }
          }
        }
      },
      "/api/ratings/{sellerId}": {
        "get": {
          "summary": "List ratings left for a seller (paginated, raters populated)",
          "tags": [
            "Ratings"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "sellerId",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Ratings list"
            }
          }
        },
        "post": {
          "summary": "Rate a seller (1-5 stars). Idempotent — calling again updates your rating.",
          "tags": [
            "Ratings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "sellerId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "stars"
                  ],
                  "properties": {
                    "stars": {
                      "type": "number",
                      "minimum": 1,
                      "maximum": 5
                    },
                    "comment": {
                      "type": "string"
                    },
                    "car": {
                      "type": "string",
                      "description": "Optional car id for context"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Rating saved"
            },
            "400": {
              "description": "Invalid input or self-rating attempt"
            },
            "404": {
              "description": "Seller not found"
            }
          }
        },
        "delete": {
          "summary": "Remove the caller's rating of this seller",
          "tags": [
            "Ratings"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "sellerId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Rating removed"
            },
            "404": {
              "description": "No rating existed"
            }
          }
        }
      },
      "/api/users/register": {
        "post": {
          "summary": "Register a new user (issues an OTP — no token until confirmed)",
          "description": "Creates the user account and returns a 6-digit OTP. In DEV mode the\nOTP is echoed in the response body. Confirm it via\nPOST /api/users/verify-otp to receive the session token.\n",
          "tags": [
            "Users"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name",
                    "phone",
                    "password",
                    "repeatPassword"
                  ],
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "phone": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    },
                    "repeatPassword": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User created — OTP issued (dev mode returns it inline)"
            }
          }
        }
      },
      "/api/users": {
        "get": {
          "summary": "Get all users",
          "tags": [
            "Users"
          ],
          "responses": {
            "200": {
              "description": "List of users"
            }
          }
        }
      },
      "/api/users/search": {
        "get": {
          "summary": "Search users by name (partial) or id (exact) — returns users with their cars populated",
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "name",
              "schema": {
                "type": "string"
              },
              "description": "Partial, case-insensitive match on user's name (e.g. \"john\" matches \"Johnny\")"
            },
            {
              "in": "query",
              "name": "q",
              "schema": {
                "type": "string"
              },
              "description": "Alias for name"
            },
            {
              "in": "query",
              "name": "id",
              "schema": {
                "type": "string"
              },
              "description": "Exact user id. Takes precedence over name when provided."
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "type": "number",
                "default": 1
              }
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "number",
                "default": 10
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Matching users, each with populated `cars` array"
            },
            "400": {
              "description": "No search param provided, or invalid id"
            }
          }
        }
      },
      "/api/users/promote-admin/{phone}": {
        "post": {
          "summary": "[One-off] Sets the role of the user with this phone to \"admin\". Idempotent.\nNo auth (dev helper).\n",
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "phone",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User promoted to admin"
            },
            "404": {
              "description": "No user with that phone"
            }
          }
        }
      },
      "/api/users/wishlist": {
        "get": {
          "summary": "Get the authenticated user's wishlist (cars populated)",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Wishlist cars"
            }
          }
        }
      },
      "/api/users/wishlist/{carId}": {
        "post": {
          "summary": "Add a car to the authenticated user's wishlist (idempotent)",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "carId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Updated wishlist"
            },
            "400": {
              "description": "Invalid car id"
            },
            "404": {
              "description": "Car not found"
            }
          }
        },
        "delete": {
          "summary": "Remove a car from the authenticated user's wishlist (idempotent)",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "carId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Updated wishlist"
            },
            "400": {
              "description": "Invalid car id"
            }
          }
        }
      },
      "/api/users/me/details": {
        "put": {
          "summary": "Upload or replace authenticated user's profile image and ID card images",
          "description": "Send any combination of the three files. Only fields present in the request are updated; omitted fields keep their current value. All three default to null until first set.\n",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "image": {
                      "type": "string",
                      "format": "binary",
                      "description": "Profile photo"
                    },
                    "idCardFront": {
                      "type": "string",
                      "format": "binary"
                    },
                    "idCardBack": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Updated user (password and activeToken omitted)"
            },
            "400": {
              "description": "No image fields were provided"
            }
          }
        }
      },
      "/api/users/{id}": {
        "get": {
          "summary": "Get a single user by ID",
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "User ID"
            }
          ],
          "responses": {
            "200": {
              "description": "User details"
            },
            "404": {
              "description": "User not found"
            }
          }
        },
        "put": {
          "summary": "Update a user",
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "User ID"
            }
          ],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "phone": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    },
                    "repeatPassword": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User updated successfully"
            },
            "404": {
              "description": "User not found"
            }
          }
        },
        "delete": {
          "summary": "Delete a user",
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "User ID"
            }
          ],
          "responses": {
            "200": {
              "description": "User deleted successfully"
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      },
      "/api/users/login": {
        "post": {
          "summary": "Step 1 of login — validates password and issues an OTP",
          "description": "Validates phone + password and returns a 6-digit OTP. In DEV mode the\nOTP is echoed in the response body for testing; in production it would\nbe sent via SMS. Confirm the OTP with POST /api/users/verify-otp.\n",
          "tags": [
            "Users"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "phone",
                    "password"
                  ],
                  "properties": {
                    "phone": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "OTP issued (dev mode returns it inline)"
            },
            "400": {
              "description": "Invalid credentials"
            }
          }
        }
      },
      "/api/users/verify-otp": {
        "post": {
          "summary": "Step 2 of login — confirm OTP, receive a session token",
          "tags": [
            "Users"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "phone",
                    "otp"
                  ],
                  "properties": {
                    "phone": {
                      "type": "string"
                    },
                    "otp": {
                      "type": "string",
                      "description": "6-digit code from POST /login"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Login successful — returns { token, user }"
            },
            "400": {
              "description": "OTP missing, expired, or invalid"
            }
          }
        }
      },
      "/api/users/reset-password": {
        "post": {
          "summary": "Reset a user's password (OTP is verified on the frontend)",
          "tags": [
            "Users"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "phone",
                    "password",
                    "repeatPassword"
                  ],
                  "properties": {
                    "phone": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    },
                    "repeatPassword": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password reset successfully"
            },
            "400": {
              "description": "Validation error"
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      },
      "/api/users/logout": {
        "post": {
          "summary": "Logout current user (invalidates the active token)",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Logged out"
            }
          }
        }
      }
    },
    "securityDefinitions": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "tags": [
      {
        "name": "Adverts",
        "description": "Advertise cars (linked to existing cars or standalone)"
      },
      {
        "name": "Bookings",
        "description": "Rental bookings (scoped to the authenticated user)"
      },
      {
        "name": "Cars",
        "description": "Car garage and marketplace endpoints"
      },
      {
        "name": "Ratings",
        "description": "Seller ratings (5-star). One rating per (seller, rater) pair."
      },
      {
        "name": "Users",
        "description": "User management endpoints"
      }
    ]
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
