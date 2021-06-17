export const TemplateProcess = {
  processData: function (userID, templateID, dataset, template, oldTemplate, originalTemp) {
    console.log(template)
    let ext_data = this.extractID(template)
    let full_data = this.getData(dataset)

    console.log("Special:", full_data)
    let res = []

    let arr = dataset

    /// --- main processing section --- ///
    let temp_type = ext_data.type

    let f_project_id = Array()
    let e_project_id = ext_data.project_id.trim()

    for (let m in full_data) f_project_id.push(full_data[m][2].trim())

    let project_variables = new Array()
    let p_node_ids = new Array()

    // in case of template type is any
    if (temp_type == "any") {
      for (let w in full_data) {
        let dataset_variables = arr.variables
        let template_variables = ext_data.variables
        let row = {}
        if (full_data[w][1] == e_project_id) {
          p_node_ids.push(full_data[w][2])

          // checking if template variables exist in dataset, and take the variables.
          for (let q in template_variables) {
            for (let m in dataset_variables) {
              if (template_variables[q].trim() == dataset_variables[m].trim()) {
                let index = Number(m) + 1
                let key = dataset_variables[m].trim()
                row[key] = full_data[w][index]
              }
            }
          }
          project_variables.push(row)
        }
      }

      let processedTemplate = this.makeTemplate(template, project_variables)

      if (processedTemplate.length > 0) {
        res = this.configTemplate(userID, templateID, processedTemplate, oldTemplate, originalTemp, e_project_id, p_node_ids)
      } else {
        res = []
      }

      // in case of template node ids are several.
    } else if (temp_type == "multiple") {
      let node_ids = new Array()

      // node ids in template
      node_ids = ext_data.node_id
      p_node_ids = node_ids

      for (let w in full_data) {
        for (let q in node_ids) {

          // in case of template node id is matched with dataset node id, 

          if (full_data[w][2] == node_ids[q].trim() && full_data[w][1] == e_project_id) {
            let dataset_variables = arr.variables
            let template_variables = ext_data.variables
            let row = {}

            // checking if template variables exist in dataset, and take the variables.
            for (let q in template_variables) {
              for (let m in dataset_variables) {
                if (template_variables[q].trim() == dataset_variables[m].trim()) {
                  let index = Number(m) + 1
                  let key = dataset_variables[m].trim()
                  row[key] = full_data[w][index]
                }
              }
            }
            project_variables.push(row)
          }
        }
      }

      let processedTemplate = this.makeTemplate(template, project_variables)

      if (processedTemplate.length > 0) {
        res = this.configTemplate(userID, templateID, processedTemplate, oldTemplate, originalTemp, e_project_id, p_node_ids)
      } else {
        res = []
      }

      // in case of template node ids is only one.
    } else if (temp_type.trim() == "single") {
      p_node_ids.push(ext_data.node_id.trim())

      for (let w in full_data) {

        // in case of template node id is matched with dataset node id, 
        if (full_data[w][2] == ext_data.node_id.trim() && full_data[w][1] == e_project_id) {
          let dataset_variables = arr.variables
          let template_variables = ext_data.variables
          let row = {}

          // checking if template variables exist in dataset, and take the variables.
          for (let q in template_variables) {
            for (let m in dataset_variables) {
              if (template_variables[q].trim() == dataset_variables[m].trim()) {
                let index = Number(m) + 1
                let key = dataset_variables[m].trim()
                row[key] = full_data[w][index]
              }
            }
          }
          project_variables.push(row)
        }
      }

      let processedTemplate = this.makeTemplate(template, project_variables)

      if (processedTemplate.length > 0) {
        res = this.configTemplate(userID, templateID, processedTemplate, oldTemplate, originalTemp, e_project_id, p_node_ids)
      } else {
        res = []
      }
    }
    return res
  },
  getData: function (data) {
    let tempArr = data.values
    let variableArr = data.variables
    let allArr = new Array()
    for (let i = 0; i < tempArr.length; i += variableArr.length) {
      let rows = new Array()
      // rows.push(data[r]._id)
      rows.push(data.title)
      for (let j = 0; j < variableArr.length; j++) {
        rows.push(tempArr[i + j])
      }
      allArr.push(rows)
    }
    return allArr
  },
  extractID: function (text) {
    let temp_string = text

    while (temp_string.indexOf('\n') > -1) {
      temp_string = temp_string.replace('\n', ' ')
    }
    while (temp_string.indexOf('  ') > -1) {
      temp_string = temp_string.replace('  ', ' ')
    }

    temp_string = temp_string.split(' ')

    let res = {}
    let variables = new Array()
    for (let i = 0; i < temp_string.length; i++) {
      if (temp_string[i] == "project_id:") res["project_id"] = temp_string[i + 1]
      if (temp_string[i] == "node_id:") {

        if (temp_string[i + 1].indexOf(',') > 1) {
          res["type"] = "multiple"
          let j = i + 1
          let node_ids = new Array()

          while (temp_string[j].indexOf(',') > 1) {
            temp_string[j] = temp_string[j].replace(',', '')
            node_ids.push(temp_string[j])
            j++
          }
          node_ids.push(temp_string[j])
          res["node_id"] = node_ids
        } else if (temp_string[i + 1].indexOf('*') > -1) {
          res["type"] = "any"
        } else {
          res["node_id"] = temp_string[i + 1]
          res["type"] = "single"
        }
      }

      if (temp_string[i].indexOf('$var_') > -1) {
        let val = temp_string[i]
        if (val.indexOf('.')) val = val.replace('.', '')
        if (val.indexOf(',')) val = val.replace(',', '')
        if (val.indexOf(':')) val = val.replace(':', '')
        variables.push(val)
      }
    }
    res["variables"] = variables
    return res
  },

  makeTemplate: function (m_template, variables) {

    let processedTemplate = new Array()
    for (let r in variables) {
      let t_template = m_template

      let keys = Object.keys(variables[r])
      let exceptChar = [" ", ".", ",", "\n", ":", "/", ";", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "|", "{", "}", "/", ""]
      for (let i = 0; i < exceptChar.length; i++) {
        for (let k in keys) {
          const regex = `${keys[k]}${exceptChar[i]}`
          const repstr = `${variables[r][keys[k]]}${exceptChar[i]}`
          t_template = t_template.replaceAll(regex, repstr);
        }
      }

      let t_str_p = t_template.match(/project_id:(.*)/)
      if (t_str_p != null) {
        let r_project_id = "project_id:" + t_str_p[1];
        t_template = t_template.replace(r_project_id, "")
      }

      let t_str_n = t_template.match(/node_id:(.*)/)
      if (t_str_n != null) {
        let r_node_id = "node_id:" + t_str_n[1];
        t_template = t_template.replace(r_node_id, "")
      }

      processedTemplate.push(t_template)
    }
    return processedTemplate
  },

  configTemplate: function (userID, templateID, templates, oldTemplate, originalTemp, project_id, node_ids) {
    // for getting timestamp
    let d = new Date();
    let timestamp = d.getFullYear() + "" +
      (d.getMonth() + 1) + "" +
      d.getDate() + "" +
      d.getHours() + "" +
      d.getMinutes() + "" +
      d.getSeconds() + "" +
      d.getMilliseconds()

    let title = project_id + "_" + timestamp
    let template = {
      "userId": userID,
      "templateId": templateID,
      "title": title,
      "templateType": "single",
      "templates": oldTemplate,
      "originalTemp": originalTemp,
      "newTemplates": templates,
      "isUpdated": "1",
      "node_ids": node_ids,
      "project_ids": "",
      "file_names": "",
      "file_types": ""
    }
    return template
  }
};
