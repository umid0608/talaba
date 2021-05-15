package uz.resus.talaba.cucumber;

import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;
import uz.resus.talaba.TalabaApp;

@CucumberContextConfiguration
@SpringBootTest(classes = TalabaApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
