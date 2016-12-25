<?php
require_once '/home/swnsma/projects/tests/vendor/autoload.php';
require_once'Framework/Record.php';
require_once'Framework/Group.php';

class FiltrationByGroup_Test extends PHPUnit_Extensions_Selenium2TestCase
{

    protected $_list = array();
    /** @var  Group */
    protected $group;

    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }

    protected function tearDown()
    {
        $this->group->deleteGroupScenario();
        /** @var Record $item */
        foreach($this->_list as $item)
        {
            $item->deleteRecordScenario();
        }
    }

    public function getMonthData()
    {
        return array(
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        );
    }

    /**
     * @dataProvider data
     *
     * @param $group
     * @param $records
     */
    public function testScenario($group, $records)
    {
        $this->group = new Group($this, $group);
        $this->group->createGroupScenario();
        foreach($records as $record) {
            $item = new Record($this, $record);
            $item->createRecordScenario();
            $this->_list[] = $item;
        }

        $this->_filterByGroup();
        $this->_verifyFiltration();
    }

    public function data()
    {
        return array(
           0 => array(
               array(
                   'name' => 'Test Group 1',
                   'header' => 'Header',
                   'footer' => 'Footer'
               ),
               array(
                   array(
                       'firstname' => 'FirstName',
                       'lastname' => 'SecondName',
                       'address' => 'Address value',
                       'home' => '+380974242432',
                       'mobile' => '+380974324324',
                       'work' => '+38097',
                       'email' => 'email@mail.com',
                       'email2' => 'email@mail.com',
                       'bday' => 11,
                       'bmonth' => $this->getMonthData()[2],
                       'byear' => 1995,
                       'group' => 'Test Group 1',
                       'address2' => 'addresssdasd',
                       'phone2' => '+380974232'
                   ),
                   array(
                       'firstname' => 'sadfasdfasd',
                       'lastname' => 'SecondName',
                       'address' => 'Address value',
                       'home' => '0974242432',
                       'mobile' => '32143124',
                       'work' => '380974324324',
                       'email' => 'email@gmail.com',
                       'email2' => 'email@mail.com',
                       'bday' => 11,
                       'bmonth' => $this->getMonthData()[5],
                       'byear' => 1999,
                       'group' => 'Test Group 1',
                       'address2' => 'addresssdasd',
                       'phone2' => '+380974232'
                   ),
                   array(
                       'firstname' => 'FirsssadfstName',
                       'lastname' => 'SecondNsdfasdfame',
                       'address' => 'Addresfasdfass value',
                       'home' => '+380974242432',
                       'mobile' => '+380974324324',
                       'work' => '+380974324324',
                       'email' => 'email@mail.com',
                       'email2' => 'email@mail.com',
                       'bday' => 11,
                       'bmonth' => $this->getMonthData()[10],
                       'byear' => 1995,
                       'group' => 'Test Group 1',
                       'address2' => 'addresssdasd',
                       'phone2' => '+380974232'
                   )
               )
           ),
            1=> array(
                array(
                    'name' => 'Ambassador',
                    'header' => 'Header',
                    'footer' => 'Footer'
                ),
                array(
                    array(
                        'firstname' => 'FirstName',
                        'lastname' => 'SecondName',
                        'address' => 'Address value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324fds',
                        'work' => '+38097',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 11,
                        'bmonth' => $this->getMonthData()[2],
                        'byear' => 1995,
                        'group' => 'Ambassador',
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'Naame',
                        'lastname' => '',
                        'address' => 'Address value',
                        'home' => '0974242432',
                        'mobile' => '324324fds',
                        'work' => '',
                        'email' => 'email.com',
                        'email2' => 'email@mail.com',
                        'bday' => 12,
                        'bmonth' => $this->getMonthData()[5],
                        'byear' => 'string',
                        'group' => 'Ambassador',
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'FirsssadfstName',
                        'lastname' => 'SecondNsdfasdfame',
                        'address' => 'Addresfasdfass value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324fds',
                        'work' => '+38097',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 12,
                        'bmonth' => $this->getMonthData()[10],
                        'byear' => 2018,
                        'group' => 'Ambassador',
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    )
                )
            )
        );
    }

    protected function _verifyFiltration()
    {
        $elements = $this->elements($this->using('css selector')->value('tr[name="entry"]'));
        $this->assertTrue(count($elements) == count($this->_list));

        /** @var Record $item */
        foreach($this->_list as $item) {
            $this->assertTrue($item->verify());
        }
    }

    protected function _filterByGroup()
    {
        $this->select($this->element($this->using('css selector')->value('select[name="group"]')))->selectOptionByLabel($this->group->name);
    }
}