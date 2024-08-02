package lk.ijse.pos_back_end.api;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.pos_back_end.bo.BOFactory;
import lk.ijse.pos_back_end.bo.custom.ItemBo;
import lk.ijse.pos_back_end.bo.custom.impl.ItemBOImpl;
import lk.ijse.pos_back_end.dao.custom.impl.ItemDAOImpl;
import lk.ijse.pos_back_end.dto.ItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet(name = "item",urlPatterns = "/item",loadOnStartup = 5)
public class ItemAPI extends HttpServlet {

    private static Logger logger = LoggerFactory.getLogger(ItemAPI.class);
    Jsonb jsonb = JsonbBuilder.create();
    ItemBo itemBO = (ItemBo) BOFactory.getBoFactory().getBO(BOFactory.BOTypes.ITEM);
    Connection connection;

    @Override
    public void init() throws ServletException {
        try {
            InitialContext ctx = new InitialContext();
            DataSource pool = (DataSource) ctx.lookup("java:comp/env/jdbc/posSystem");
            System.out.println(pool);
            this.connection = pool.getConnection();
        } catch (SQLException | NamingException e) {
            e.printStackTrace();
        }
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ItemDTO itemDTO = jsonb.fromJson(req.getReader(),ItemDTO.class);
        itemBO.saveItem(itemDTO,connection);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ItemDTO itemDTO = jsonb.fromJson(req.getReader(),ItemDTO.class);
        itemBO.updateItem(itemDTO,connection);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ItemDTO itemDTO = jsonb.fromJson(req.getReader(),ItemDTO.class);
        itemBO.deleteItem(itemDTO,connection);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter writer = resp.getWriter();
        String allItems = itemBO.getAllItemData(connection,resp);
        writer.println(allItems);
    }
}
