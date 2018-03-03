var app = new Vue({
  el: '#app',
  data: {
    apiKey: 'nSzjCtsDRit0aoKoPG1y8JziPB3YlYoZ',
    domainName: '',
    domainIsAvailable: 'Domain is not available for registration',
    createdAt: '---',
    screenshot: false,
    webmasterEmail: 'Email is NOT deliverable',
    location: ''
  },
  methods: {
    searchDomain: function() {
      var vm = this;

      // Domain check
      axios.get('https://api.webcargo.io/availability', {
        params: {
          key: vm.apiKey,
          domain: vm.domainName
        }
      })
      .then(function (response) {
        if (response.data.is_available)
          vm.domainIsAvailable = 'Domain is available for registration';
        else
          vm.domainIsAvailable = 'Domain is not available for registration';
      })
      .catch(function (error) {
        console.log(error);
      });

      // Get whois data
      axios.get('https://api.webcargo.io/whois', {
        params: {
          key: vm.apiKey,
          identifier: vm.domainName
        }
      })
      .then(function (response) {
        if (response.data.result.created)
          vm.createdAt = response.data.result.created;
        else
          vm.createdAt = 'Not yet created';
      })
      .catch(function (error) {
        console.log(error);
      });

      // Get screenshot
      vm.screenshot = false;
      axios.get('https://api.webcargo.io/screenshot', {
        params: {
          key: vm.apiKey,
          url: vm.domainName
        }
      })
      .then(function (response) {
        if (response.data.prefix)
          vm.screenshot = response.data.prefix + ' ' + response.data.base64;
        else
          vm.screenshot = false;
      })
      .catch(function (error) {
        console.log(error);
      });

      // Check email webmaster@***
      axios.get('https://api.webcargo.io/email', {
        params: {
          key: vm.apiKey,
          email: 'webmaster@' + vm.domainName
        }
      })
      .then(function (response) {
        if (response.data.deliverable)
          vm.webmasterEmail = 'Email is deliverable';
        else
          vm.webmasterEmail = 'Email is NOT deliverable';
      })
      .catch(function (error) {
        console.log(error);
      });

      // Get location
      axios.get('http://ip-api.com/json/' + vm.domainName)
      .then(function (response) {
        if (response.data.city)
          vm.location = response.data.city + ', ' + response.data.country;
        else
          vm.location = '';
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }
})
