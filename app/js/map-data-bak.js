$('.ui.dropdown')
  .dropdown()
;
var provinces = [
  {
    'id':1,
    'region_code':'110000',
    'name':'北京',
    'total':278
  },
  {
    'id':2,
    'region_code':'310000',
    'name':'上海',
    'total':278
  },
  {
    'id':3,
    'region_code':'440000',
    'name':'广东',
    'total':278
  },
  {
    'id':4,
    'region_code':'330000',
    'name':'浙江',
    'total':278
  },
  {
    'id':5,
    'region_code':'00000',
    'name':'江苏',
    'total':0
  },
  {
    'id':5,
    'region_code':'00000',
    'name':'山东',
    'total':0
  },
  {
    'id':5,
    'region_code':'00000',
    'name':'山西',
    'total':0
  },
  {
    'id':5,
    'region_code':'00000',
    'name':'福建',
    'total':0
  }

];
var citys = [
  {
    'id':1,
    'region_code':'330100',
    'name':'杭州',
    'active':false,
    'total':278
  },
  {
    'id':2,
    'region_code':'330300',
    'name':'温州',
    'active':false,
    'total':278
  },
  {
    'id':3,
    'region_code':'440600',
    'name':'佛山',
    'active':false,
    'total':278
  }
];
var query_string = {
  data_type:1,
  region_code:''
}


var UIProvinces = React.createClass({
  handleItemSelected: function(item,i){
    query_string.region_code = item.region_code;
    this.props.onItemSelected({region_code:item.region_code});
    this.props.data.forEach(function(item,j){
      if(i == j){
        item.active = true;
      }else{
        item.active = false;
      }
    });
    var map = $('path.province div');
    map.each(function(){
      var str = $(this).text();
      if(str.indexOf(item.name)>=0){
        $(this).parent().css({
          "fill":"red",
          "stroke":'red'
        });
      }else{
        $(this).parent().css({
          "fill":"#fff",
          "stroke":'#333'
        });
      }
    });
  },
  render: function() {
    var _this = this;
    var UIList = _this.props.data.map(function(item,i){
      if(item.total){
        return (
          <li key={i} className={item.active ? 'active' : null }>
            <a href="javascript:;" onClick={_this.handleItemSelected.bind(_this, item, i)}>
              {item.name}
              <span className="pull-right">{item.id}</span>
            </a>
          </li>
        );
      }else{
        return (
          <li key={i} className={item.active ? 'active' : null }>
           {item.name}
           <span className="pull-right">{item.id}</span>
          </li>
        );
      }
    })
    return (
      <div className="cards">
        <div className="data-heading"><b>省级地区</b></div>
        <ul className="list list-style basic none">
          {UIList}
        </ul>
      </div>
    );
  }
});
var UICitys = React.createClass({
  getInitialState: function() {
    return {lists: citys};
  },
  handleItemSelected: function(item,i){
    query_string.region_code = item.region_code;
    this.props.onItemSelected({region_code:item.region_code});
    this.state.lists.forEach(function(item,j){
      if(i == j){
        item.active = true;
      }else{
        item.active = false;
      }
    });
    var map = $('path.province div');
    map.each(function(){
      var str = $(this).text();
      if(str.indexOf(item.name)>=0){
        $(this).parent().css({
          "fill":"red",
          "stroke":'red'
        });
      }else{
        $(this).parent().css({
          "fill":"#eee",
          "stroke":'#333'
        });
      }
    });
  },
  render: function() {
    var _this = this;
    var UIList = _this.state.lists.map(function(item,i){
      if(item.total){
        return (
          <li key={i} className={item.active ? 'active' : null }>
            <a href="javascript:;" onClick={_this.handleItemSelected.bind(_this, item, i)}>
              {item.name}
              <span className="pull-right">{item.id}</span>
            </a>
          </li>
        );
      }else{
        return (
          <li key={i} className={item.active ? 'active' : null }>
           {item.name}
           <span className="pull-right">{item.id}</span>
          </li>
        );
      }
    })
    return (
      <div className="cards">
        <div className="data-heading"><b>市级地区</b></div>
        <ul className="list list-style basic none">
          {UIList}
        </ul>
      </div>
    );
  }
});

var catelogs = [
  {
    'id':1,
    'data_type':1,
    'name':'药品目录',
    'active':true,
    'total':278
  },
  {
    'id':2,
    'data_type':2,
    'name':'诊疗服务目录',
    'active':false,
    'total':278
  },
  {
    'id':3,
    'data_type':3,
    'name':'医疗设施目录',
    'active':false,
    'total':278
  }
];
var UICatelogs = React.createClass({
  handleItemSelected: function(item,i){
    query_string.data_type = item.data_type;
    this.props.onItemSelected({data_type:item.data_type});
    this.props.data.forEach(function(item,j){
      if(i == j){
        item.active = true;
      }else{
        item.active = false;
      }
    })
  },
  render: function() {
    var _this = this;
    var UILists = _this.props.data.map(function(item, i){
      if(item.total){
        return (
          <li key={i} className={item.active ? 'active' : null }>
            <a href="javascript:;" onClick={_this.handleItemSelected.bind(_this, item,i)}>
              {item.name}
              <span className="pull-right">{item.id}</span>
            </a>
          </li>
        );
      }else{
        return (
          <li key={i}>
           {item.name}
           <span className="pull-right">{item.total}</span>
          </li>
        );
      }
    })
    return (
      <div className="cards">
        <div className="data-heading"><b>医保数据导航</b></div>
        <ul className="list list-style basic none">
          {UILists}
        </ul>
      </div>
    );
  }
});

var UIMulus = React.createClass({
  render: function() {
    var data_type = null;
    if(this.props.data.length >= 1){
      data_type = this.props.data[0].data_type;
    }
    var setHeader = function(){
      switch (data_type) {
        case 1:
          return (
            <tr>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>药品名称</th>
              <th>其他</th>
            </tr>
          );
          break;
        case 2:
          return (
            <tr>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>服务名称</th>
              <th>其他</th>
            </tr>
          );
          break;
        case 3:
          return (
            <tr>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>设施名称</th>
              <th>其他</th>
            </tr>
          );
          break;
        default:
          return (
            <tr>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>未检索到相关数据。</th>
              <th>&nbsp;</th>
            </tr>
          );
          break;
      }
    }
    var UIHeader = setHeader();
    
    var UILists = this.props.data.map(function(item,i){
      switch (data_type) {
        case 1:
          return (
            <tr key={i}>
              <td>{item.name}</td>
              <td>其他</td>
            </tr>
          );
          break;
        case 2:
          return (
            <tr key={i}>
              <td>{item.name}</td>
              <td>其他</td>
            </tr>
          );
          break;
        case 3:
          return (
            <tr key={i}>
              <td>{item.name}</td>
              <td>其他</td>
            </tr>
          );
          break;
        default:
          return (
            <tr key={i}>
              <td>其他</td>
              <td>其他</td>
            </tr>
          );
          break;
      }
    })
    return (
        <div className="cards"> 
          <div className="data-heading"><b>目录数据详情</b></div>
          <div className="table" >
            <table>
              <thead>
              {UIHeader}
              </thead>
              <tbody>
                {UILists}
              </tbody>
            </table>
          </div>
        </div>
    );
  }
});

var UIPage = React.createClass({
  ajaxMulus:function(){
    var url = '/api/mulu';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query_string,
      success: function(data) {
        this.setState({mulus: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  ajaxStatistics:function(){
    var url = '/api/muluStatistics';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query_string,
      success: function(data) {
        this.setState({mulus: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      mulus: [],
      provinces: provinces,
      catelogs: catelogs
    };
  },
  componentDidMount: function() {
      this.ajaxMulus();
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-2 grid-cell">
          <UICatelogs data={this.state.catelogs} onItemSelected={this.ajaxMulus}/>
        </div>
        <div className="col-md-2 grid-cell" >
          <UIProvinces data={this.state.provinces} onItemSelected={this.ajaxMulus} />
        </div>
        <div className="col-md-2 grid-cell">
          <UICitys onItemSelected={this.ajaxMulus}/>
        </div>
        <div className="col-md-6 grid-cell">
          <UIMulus data={this.state.mulus} />
        </div>
      </div>
    );
  }
});
ReactDOM.render(
    <UIPage />,
    document.getElementById('UIPageContainer')
);


