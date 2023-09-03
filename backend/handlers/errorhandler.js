

const uniqueMessage = (error) => {
  let output;
  let field;
  try {
    let fieldName = error.message.split(":")[2];
    field = fieldName.split(" dup key")[0];
    field = field.substring(0, field.lastIndexOf("_"));
    output = "Field" + field + " already exists";
  } catch (ex) {
    output = "already exists";
  }

  return output;
};

export const errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errors) {
      if (error.errors[errorName].message)
        message = error.errors[errorName].message;
    }
  }

  return message;
};
