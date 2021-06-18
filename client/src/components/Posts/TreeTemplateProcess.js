export const TreeTemplateProcess = {
  processData: function (userID, templateID, templateTitle, dataset, treeTemplates, oldTemplate, originalTemp, fileNames, fileTypes) {
    let res = ""
    let templateData = new Array()
    for(let template of treeTemplates) templateData.push(this.extractID(template))

    let processedTemplate = new Array()
    let p_node_ids = new Array();
    let p_project_ids = new Array();
    let p_file_names = fileNames;
    let p_file_types = fileTypes;
    let datasets = this.getData(dataset)

    for (let template of templateData){
      let e_project_id = template.project_id;
      if(e_project_id == undefined || template.node_id == undefined){
        processedTemplate.push(template.content)
        continue
      }

      let project_variables = new Array();
      p_node_ids.push(template.node_id.trim());
      p_project_ids.push(template.project_id.trim());

      for (let w in datasets) {
        // in case of template node id is matched with dataset node id,
        if (
          datasets[w][2] == template.node_id.trim() &&
          datasets[w][1] == e_project_id.trim()
        ) {
          let dataset_variables = dataset.variables;
          let template_variables = template.variables;
          let row = {};

          // checking if template variables exist in dataset, and take the variables.
          for (let q in template_variables) {
            for (let m in dataset_variables) {
              console.log(q, ":", template_variables[q].trim(), m, ":", dataset_variables[m].trim())
              if (
                template_variables[q].trim() ==
                dataset_variables[m].trim()
              ) {
                let index = Number(m)+1;
                let key = dataset_variables[m].trim();
                row[key] = datasets[w][index];
              }
            }
          }
          project_variables.push(row);
        }
      }

      let maketemplate = this.makeTemplate(
          template.content,
          project_variables
        );
      maketemplate[0] = maketemplate[0] == undefined ? template.content : maketemplate[0]
      processedTemplate.push(maketemplate[0])
    }

    if (processedTemplate.length > 0) {
      let saveTemplates = this.configTemplate(
        userID,
        templateID,
        templateTitle,
        processedTemplate,
        oldTemplate,
        originalTemp,
        p_node_ids,
        p_project_ids,
        p_file_names,
        p_file_types
      );

      res = saveTemplates
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
    let temp_string = text;

    while (temp_string.indexOf("\n") > -1) {
      temp_string = temp_string.replace("\n", " ");
    }
    while (temp_string.indexOf("  ") > -1) {
      temp_string = temp_string.replace("  ", " ");
    }

    temp_string = temp_string.split(" ");

    let res = {};
    let variables = new Array();
    for (let i = 0; i < temp_string.length; i++) {
      if (temp_string[i] == "project_id:")
        res["project_id"] = temp_string[i + 1];
      if (temp_string[i] == "node_id:") {
        if (temp_string[i + 1].indexOf(",") > 1) {
          res["type"] = "multiple";
          let j = i + 1;
          let node_ids = new Array();

          while (temp_string[j].indexOf(",") > 1) {
            temp_string[j] = temp_string[j].replace(",", "");
            node_ids.push(temp_string[j]);
            j++;
          }
          node_ids.push(temp_string[j]);
          res["node_id"] = node_ids;
        } else if (temp_string[i + 1].indexOf("*") > -1) {
          res["type"] = "any";
        } else {
          res["node_id"] = temp_string[i + 1];
          res["type"] = "single";
        }
      }

      if (temp_string[i].indexOf("$var_") > -1) {
        let val = temp_string[i];
        if (val.indexOf(".")) val = val.replace(".", "");
        if (val.indexOf(",")) val = val.replace(",", "");
        if (val.indexOf(":")) val = val.replace(":", "");
        variables.push(val);
      }
    }
    res["variables"] = variables;
    res["content"] = text
    return res;
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

  configTemplate: function (userID, templateID, templateTitle, templates, oldTemplate, originalTemp, node_ids, project_ids, file_names, file_types) {
   
    let template = {
      "userId": userID,
      "templateId": templateID,
      "title": templateTitle,
      "templateType": "tree",
      "templates": oldTemplate,
      "originalTemp": originalTemp,
      "newTemplates": templates,
      "isUpdated": "1",
      "node_ids": node_ids,
      "project_ids": project_ids,
      "file_names": file_names,
      "file_types": file_types
    }

    return template
  }
};
