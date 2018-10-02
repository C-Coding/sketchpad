module.exports = {
    src_folders: ['test'],//测试文件路径
    output_folder: 'test/output',//输出报告文件位置
    custom_assertions_path: [],
    page_objects_path: '',
    globals_path: '',

    selenium: {
        start_process: true,
        server_path: require('selenium-server').path,
        host: '127.0.0.1',
        port: 5555,
        cli_args: {
            'webdriver.chrome.driver': require('chromedriver').path
        }
    },

    test_settings: {
        default: {
            selenium_port: 5555,
            selenium_host: 'localhost',
            silent: true,
            globals: {
                devServerURL: 'http://localhost:' + (process.env.PORT || 1111)
            }
        },

        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true
            }
        }
    }
}