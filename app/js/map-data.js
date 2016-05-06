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
  }
];
var citys = [
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
    'region_code':'440100',
    'name':'广州',
    'total':278
  },
  {
    'id':4,
    'region_code':'330100',
    'name':'杭州',
    'total':278
  },
  {
    'id':5,
    'region_code':'440600',
    'name':'佛山',
    'total':0
  }
];
var query_string = {
  data_type:1,
  region_code:'110000'
}



var UIProvinces = React.createClass({
  ajaxLists:function(){
    // var url = '/api/provinces';
    // $.ajax({
    //   url: url,
    //   dataType: 'json',
    //   type: 'GET',
    //   data: '',
    //   success: function(data) {
    //     this.setState({lists: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(url, status, err.toString());
    //   }.bind(this)
    // });
    this.setState({lists: provinces});
  },
  getInitialState: function() {
    return {lists: []};
  },
  componentDidMount: function() {
      this.ajaxLists();
  },
  render: function() {
    var UILists = this.state.lists.map(function(item,i){
      if(item.total){
        return (
          <li key={i}>
            <a href="#">
              {item.name}
              <span className="pull-right">{item.total}</span>
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
        <div className="data-heading"><b>省级地区</b></div>
        <ul className="list list-style basic none">
          {UILists}
        </ul>
      </div>
    );
  }
});


var UICitys = React.createClass({
  getInitialState: function() {
    return {citys: provinces};
  },
  render: function() {
    var UICity = this.state.citys.map(function(item,i){
      if(item.total){
        return (
          <li key={i}>
            <a href="#">
              {item.name}
              <span className="pull-right">{item.total}</span>
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
        <div className="data-heading"><b>市级地区</b></div>
        <ul className="list list-style basic none">
          {UICity}
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
    'total':278
  },
  {
    'id':2,
    'data_type':2,
    'name':'诊疗服务目录',
    'total':278
  },
  {
    'id':3,
    'data_type':3,
    'name':'医疗设施目录',
    'total':278
  }
];
var UICatelogs = React.createClass({
  getInitialState: function() {
    return {lists: catelogs};
  },
  handleItemSelected: function(item){
    query_string.data_type = item.data_type;
    console.log('click item',item);
    console.log('query_string',query_string);
    $(window).trigger('muluFilterChanged');
  },
  render: function() {
    var _this = this;
    var UILists = _this.state.lists.map(function(item, i){
      if(item.total){
        return (
          <li key={i}>
            <a href="javascript:;" onClick={_this.handleItemSelected.bind(this, item)}>
              {item.name}
              <span className="pull-right">{item.total}</span>
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
        <div className="data-heading"><b>目录导航</b></div>
        <ul className="list list-style basic none">
          {UILists}
        </ul>
      </div>
    );
  }
});

var UIMulus = React.createClass({
  ajaxLists:function(){
    console.log('triggered');
    var url = '/api/mulu';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query_string,
      success: function(data) {
        console.log('medication data',data);
        this.setState({lists: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {lists: []};
  },
  componentDidMount: function() {
      this.ajaxLists();
      window.addEventListener('muluFilterChanged', this.ajaxLists);
  },
  componentWillUnmount: function() {
      window.removeEventListener('muluFilterChanged', this.ajaxLists);
  },
  render: function() {
    var data_type = null;
    if(this.state.lists.length >= 1){
      data_type = this.state.lists[0].data_type;
    }
    var setHeader = function(){
      switch (data_type) {
        case 1:
          return (
            <thead>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>药品名称</th>
              <th>其他</th>
            </thead>
          );
          break;
        case 2:
          return (
            <thead>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>服务名称</th>
              <th>其他</th>
            </thead>
          );
          break;
        case 3:
          return (
            <thead>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>设施名称</th>
              <th>其他</th>
            </thead>
          );
          break;
        default:
          return (
            <thead>
              <th style={{textAlign:'left',paddingLeft:'10px',paddingTop:'5px'}}>其他</th>
              <th>其他</th>
            </thead>
          );
          break;
      }
    }
    var UIHeader = setHeader();
    
    var UILists = this.state.lists.map(function(item,i){
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
              <td>服务名称</td>
              <td>其他</td>
            </tr>
          );
          break;
        case 3:
          return (
            <tr key={i}>
              <td>设施名称</td>
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
              {UIHeader}
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

  render: function() {
    return (
      <div className="row">
        <div className="col-md-2 grid-cell" >
          <UIProvinces />
        </div>
        <div className="col-md-2 grid-cell">
          <UICitys />
        </div>
        <div className="col-md-2 grid-cell">
          <UICatelogs />
        </div>
        <div className="col-md-6 grid-cell">
          <UIMulus />
        </div>
      </div>
    );
  }
});
ReactDOM.render(
    <UIPage />,
    document.getElementById('UIPageContainer')
);


