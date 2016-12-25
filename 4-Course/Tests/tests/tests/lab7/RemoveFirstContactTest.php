<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';

class AddNewContact_Test extends \PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }

    protected $_list = array();

    public function getContactTestData()
    {
        return array(
            'firstname' => 'firstname' . rand(1, 10000),
            'lastname' => 'lastname' . rand(1, 10000),
            'address' => 'address' . rand(1, 10000),
            'home' => '+38097' . rand(1000000, 9999999),
            'mobile' => '+38097' . rand(1000000, 9999999),
            'work' => '+38097' . rand(1000000, 9999999),
            'email' => 'email' . rand(100, 19000) . '@mail.com',
            'email2' => 'email' . rand(100, 19000) . '@mail.com',
            'bday' => rand(1, 31),
            'bmonth' => $this->getMonthData()[rand(0, 11)],
            'byear' => rand(1950, 2010),
            'address2' => 'address' . rand(1, 10000),
            'phone2' => '+38097' . rand(1000000, 9999999)
        );
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

    public function fillContactForm($data)
    {
        $element = $this->element($this->using('css selector')->value('input[name="firstname"]'));
        $element->value($data['firstname']);
        $element = $this->element($this->using('css selector')->value('input[name="lastname"]'));
        $element->value($data['lastname']);
        $element = $this->element($this->using('css selector')->value('textarea[name="address"]'));
        $element->value($data['address']);
        $element = $this->element($this->using('css selector')->value('input[name="home"]'));
        $element->value($data['home']);
        $element = $this->element($this->using('css selector')->value('input[name="mobile"]'));
        $element->value($data['mobile']);
        $element = $this->element($this->using('css selector')->value('input[name="work"]'));
        $element->value($data['work']);
        $element = $this->element($this->using('css selector')->value('input[name="email"]'));
        $element->value($data['email']);
        $element = $this->element($this->using('css selector')->value('input[name="email2"]'));
        $element->value($data['email2']);
        $this->select($this->element($this->using('css selector')->value('select[name="bday"]')))->selectOptionByValue($data['bday']);
        $this->select($this->element($this->using('css selector')->value('select[name="bmonth"]')))->selectOptionByValue($data['bmonth']);
        $element = $this->element($this->using('css selector')->value('input[name="byear"]'));
        $element->value($data['byear']);
        $element = $this->element($this->using('css selector')->value('textarea[name="address2"]'));
        $element->value($data['address2']);
        $element = $this->element($this->using('css selector')->value('input[name="phone2"]'));
        $element->value($data['phone2']);

    }

    public function submitCreation()
    {
        $element = $this->element($this->using('css selector')->value('input[name="submit"]'));
        $element->click();
    }

    public function openAddNewPage()
    {
        $this->url('http://tests.local/edit.php');
    }

    public function addRecords()
    {
        $iterator = rand(1, 3);

        while($iterator--) {
            $this->openAddressList();
            $this->openAddNewPage();
            $contactData = $this->getContactTestData();
            $this->_list[] = $contactData;
            $this->fillContactForm($contactData);
            $this->submitCreation();
            $this->openAddressList();
            $this->assertTrue($this->verify($contactData));
        }
    }

    public function testScenario()
    {
        $this->addRecords();
        $this->selectFirstRecord();
        $this->deleteFirstElement();
        $this->goToHomePage();
        $this->assertFalse($this->verify($this->_list[0]));
        unset($this->_list[0]);
        $this->cleanUp();
    }

    public function cleanUp()
    {
        foreach($this->_list as $item) {
            $this->selectRecord($item);
            $this->deleteFirstElement();
            $this->goToHomePage();
        }
    }
    public function selectRecord($element)
    {
        $firstname = $element['firstname'];
        $this->byXPath('//*[@id="maintable"]/tbody/tr/td[text()="' . $firstname . '"]/../td/a/img[@title="Edit"]/..')->click();
    }


    public function goToHomePage()
    {
        $this->byXPath('//*[@id="content"]/div/i/a')->click();
    }

    public function deleteFirstElement()
    {
        $element = $this->element($this->using('css selector')->value('input[value="Delete"]'));
        $element->click();
    }

    public function selectFirstRecord()
    {
        $firstname = $this->_list[0]['firstname'];
        $this->byXPath('//*[@id="maintable"]/tbody/tr/td[text()="' . $firstname . '"]/../td/a/img[@title="Edit"]/..')->click();
    }

    public function verify($criteria)
    {
        $elements = $this->elements($this->using('css selector')->value('#maintable td'));
        $checks = array(
            'firstname' => false,
            'lastname' => false,
            'home' => false
        );

        foreach($checks as $key => $check) {
            foreach($elements as $element) {
                if ($element->text() == $criteria[$key]) {
                    echo $element->text();
                    continue 2;
                }
            }
            return false;
        }
        $elements = $this->elements($this->using('css selector')->value('#maintable td a'));

        foreach($elements as $element) {
            if ($element->text() == $criteria['email']) {
                echo $element->text();
                return true;
            }
        }

        return false;
    }

    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
    }
}
