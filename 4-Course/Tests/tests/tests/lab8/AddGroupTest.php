<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';
require_once'Framework/Record.php';
require_once'Framework/Group.php';

class Address_AddToGroup_Test extends \PHPUnit_Extensions_Selenium2TestCase
{
    /** @var  Group */
    protected $group;
    protected $_list;

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

        $item->openAddressList();


        $countAddress = $this->getAddressCount();
        $countGroups = $this->getGroupCount();
        $selectAddress = rand(1, $countAddress);
        $selectGroup = rand(1, $countGroups);


        $this->selectAddress($selectAddress);
        $this->addAddressToGroup($selectGroup);
        $item->openAddressList();
        $this->byCssSelector('select[name="group"]')->click();


        $group = $this->elements($this->using('css selector')->value('select[name="group"] option'))[$selectGroup + 2 - 1];
        $group->click();


        $selectAddressId = $this->getSelectAddressId($selectAddress);


        $value = $this->byCssSelector("#maintable tr td input[id={$selectAddressId}]");
        if ($value) {
            $this->assertTrue(true);
        } else {
            $this->assertTrue(false);
        }
    }
    protected function addAddressToGroup($selectGroup)
    {
        $this->byCssSelector('select[name="to_group"]')->click();


        $group = $this->elements($this->using('css selector')->value('select[name="to_group"] option'))[$selectGroup - 1];
        $group->click();


        $this->byCssSelector('form[name="MainForm"] input[name="add"]')->click();
    }


    protected function getSelectAddress($selectAddress)
    {
        return $this->elements($this->using('css selector')->value('#maintable tr td input'))[$selectAddress - 1];
    }
    protected function selectAddress($selectAddress)
    {
        $this->getSelectAddress($selectAddress)->click();
    }


    protected function getSelectAddressId($selectAddress)
    {
        return $this->getSelectAddress($selectAddress)->attribute('id');
    }

    protected function getAddressCount()
    {
        $items = $this->elements($this->using('css selector')->value('#maintable tr td input'));
        return count($items) - 1;
    }

    protected function getGroupCount()
    {
        $items = $this->elements($this->using('css selector')->value('select[name="to_group"] option'));
        return count($items);
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
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    )
                )
            )
        );
    }
}
